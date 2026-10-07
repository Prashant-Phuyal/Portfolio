/**
 * A small retrieval engine that runs in the browser.
 *
 * This powers the "Ask this site" demo. It is honest about what it is: TF-IDF
 * over a bag of words with cosine similarity — lexical retrieval, not dense
 * embeddings. Shipping a real embedding model to the browser would mean a
 * multi-megabyte download for a portfolio page, which is not a trade worth
 * making. Production systems use sentence-transformers and Qdrant; the shape of
 * the pipeline here is the same, and so is the part that matters most: the
 * similarity threshold that makes the system decline to answer.
 *
 * No dependencies, no network calls. Everything happens on the visitor's device.
 */

export type Passage = {
  id: string;
  /** Where this came from, shown as a badge on the result. */
  source: string;
  /** Anchor on the page, so a result can be clicked through to. */
  href?: string;
  text: string;
};

export type Scored = {
  passage: Passage;
  score: number;
  /** Query terms that actually matched, for highlighting. */
  matched: string[];
};

export type SearchResult = {
  hits: Scored[];
  /** True when the best score fell under the threshold. */
  refused: boolean;
  /** Real measurements, reported in the UI rather than invented. */
  timings: { tokenise: number; score: number; total: number };
  stats: { passages: number; terms: number; vocabulary: number };
};

/** Words carrying no retrieval signal. Kept short on purpose. */
const STOPWORDS = new Set([
  "a","an","and","are","as","at","be","been","but","by","can","did","do","does",
  "for","from","had","has","have","he","her","his","how","i","in","is","it",
  "its","me","my","of","on","or","our","she","so","than","that","the","their",
  "them","then","there","these","they","this","to","was","we","were","what",
  "when","where","which","who","why","will","with","would","you","your","if",
  "about","any","some",
  /*
    Conversational filler. These carry no retrieval signal, and leaving them in
    produces confident nonsense: "do you know kubernetes?" matched a passage on
    the word "know" alone and answered, when the honest result is a refusal.
  */
  "tell","know","knows","like","ever","just","very","really","please","say",
  "says","said","think","also","much","many","got","get","give","show","want",
]);

/**
 * Crude suffix stripping. A real stemmer (Porter) is more correct, but this
 * covers the cases that matter here — plurals and -ing/-ed verb forms — without
 * mangling the technical vocabulary this corpus is full of.
 */
function stem(token: string): string {
  if (token.length <= 4) return token;

  let result = token;

  for (const suffix of ["ing", "edly", "ies", "ed", "es", "s"]) {
    if (token.endsWith(suffix) && token.length - suffix.length >= 3) {
      const base = token.slice(0, token.length - suffix.length);
      result = suffix === "ies" ? `${base}y` : base;
      break;
    }
  }

  /*
    Collapse a trailing y onto i so the forms of a word converge. Without this,
    "studied" stems to "studi" while "study" stays "study", and a search for
    "where did you study?" misses the passage that answers it. Applied to the
    query and the corpus alike, so the two always meet in the middle.
  */
  if (result.length > 3 && result.endsWith("y")) {
    result = `${result.slice(0, -1)}i`;
  }

  return result;
}

export function tokenise(text: string): string[] {
  const raw = text
    .toLowerCase()
    /* Keep inner dots and plus signs so "banau.ai" and "c++" survive. */
    .replace(/[^a-z0-9+.\s-]/g, " ")
    .split(/[\s\-]+/)
    .map((token) => token.replace(/^\.+|\.+$/g, ""))
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));

  const out: string[] = [];

  for (const token of raw) {
    out.push(stem(token));

    /*
      Also index the parts of a dotted name. Without this, searching "banau"
      misses every passage, because they all contain "banau.ai" — one token the
      query never matches.
    */
    if (token.includes(".")) {
      for (const part of token.split(".")) {
        if (part.length > 1 && !STOPWORDS.has(part)) out.push(stem(part));
      }
    }
  }

  return out;
}

type Index = {
  passages: Passage[];
  /** Per passage: term → tf-idf weight, plus the vector's magnitude. */
  vectors: Map<string, number>[];
  norms: number[];
  idf: Map<string, number>;
  vocabulary: number;
};

/** Builds the inverted index once, at module load. */
export function buildIndex(passages: Passage[]): Index {
  const docs = passages.map((passage) => tokenise(passage.text));

  const documentFrequency = new Map<string, number>();
  for (const tokens of docs) {
    for (const term of new Set(tokens)) {
      documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
    }
  }

  const total = docs.length;
  const idf = new Map<string, number>();
  for (const [term, count] of documentFrequency) {
    /* Smoothed idf, so a term in every document still scores above zero. */
    idf.set(term, Math.log((total + 1) / (count + 1)) + 1);
  }

  const vectors: Map<string, number>[] = [];
  const norms: number[] = [];

  for (const tokens of docs) {
    const counts = new Map<string, number>();
    for (const term of tokens) counts.set(term, (counts.get(term) ?? 0) + 1);

    const vector = new Map<string, number>();
    let sumOfSquares = 0;

    for (const [term, count] of counts) {
      /* Sub-linear term frequency: the tenth mention adds little. */
      const weight = (1 + Math.log(count)) * (idf.get(term) ?? 1);
      vector.set(term, weight);
      sumOfSquares += weight * weight;
    }

    vectors.push(vector);
    norms.push(Math.sqrt(sumOfSquares) || 1);
  }

  return { passages, vectors, norms, idf, vocabulary: idf.size };
}

/**
 * Scores the query against every passage and returns the top matches.
 *
 * `threshold` is the whole point of the demo: below it the engine reports that
 * it cannot answer rather than handing back its best bad guess.
 */
export function search(
  index: Index,
  query: string,
  { topK = 3, threshold = 0.08 }: { topK?: number; threshold?: number } = {}
): SearchResult {
  const started = performance.now();

  const queryTokens = tokenise(query);
  const afterTokenise = performance.now();

  if (queryTokens.length === 0) {
    return {
      hits: [],
      refused: true,
      timings: { tokenise: afterTokenise - started, score: 0, total: afterTokenise - started },
      stats: {
        passages: index.passages.length,
        terms: 0,
        vocabulary: index.vocabulary,
      },
    };
  }

  const counts = new Map<string, number>();
  for (const term of queryTokens) {
    counts.set(term, (counts.get(term) ?? 0) + 1);
  }

  const queryVector = new Map<string, number>();
  let queryNorm = 0;
  for (const [term, count] of counts) {
    const weight = (1 + Math.log(count)) * (index.idf.get(term) ?? 1);
    queryVector.set(term, weight);
    queryNorm += weight * weight;
  }
  queryNorm = Math.sqrt(queryNorm) || 1;

  const scored: Scored[] = index.passages.map((passage, position) => {
    const vector = index.vectors[position];
    let dot = 0;
    const matched: string[] = [];

    for (const [term, weight] of queryVector) {
      const docWeight = vector.get(term);
      if (docWeight) {
        dot += weight * docWeight;
        matched.push(term);
      }
    }

    return {
      passage,
      score: dot / (queryNorm * index.norms[position]),
      matched,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const hits = scored.filter((hit) => hit.score > 0).slice(0, topK);
  const finished = performance.now();

  return {
    hits,
    refused: hits.length === 0 || hits[0].score < threshold,
    timings: {
      tokenise: afterTokenise - started,
      score: finished - afterTokenise,
      total: finished - started,
    },
    stats: {
      passages: index.passages.length,
      terms: queryTokens.length,
      vocabulary: index.vocabulary,
    },
  };
}

"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CornerDownLeft, Search, ShieldAlert, Sparkles } from "lucide-react";
import Heading from "./Heading";
import { Reveal } from "./Motion";
import { buildIndex, search, type SearchResult } from "../lib/retrieval";
import { corpus, suggestedQuestions } from "../data/corpus";

/*
  "Ask this site" — a working retrieval engine over this page's own content.

  The point is not the search box. It's what the box shows you: the passages it
  retrieved, what it scored them, and the moment it decides the best match is
  too weak and declines to answer. That refusal is the thing I care most about
  in the systems I build, so the demo surfaces it rather than hiding it.
*/

const THRESHOLD = 0.08;

/** Wraps matched terms so the reader can see why a passage was retrieved. */
function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;

  /* Match on the stem, so "retrieval" is highlighted for a "retrieve" query. */
  const pattern = new RegExp(
    `\\b(${terms
      .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})\\w*`,
    "gi"
  );

  const pieces = text.split(pattern);

  return (
    <>
      {pieces.map((piece, index) =>
        index % 2 === 1 ? (
          <mark key={index} className="hl">
            {piece}
          </mark>
        ) : (
          <span key={index}>{piece}</span>
        )
      )}
    </>
  );
}

function ScoreBar({ score }: { score: number }) {
  /* Cosine rarely exceeds ~0.6 here, so scale for a readable bar. */
  const width = Math.min(Math.round((score / 0.6) * 100), 100);

  return (
    <div className="flex items-center gap-2.5">
      <div className="h-[3px] w-20 overflow-hidden bg-line">
        <div
          className="h-full bg-fg transition-[width] duration-700 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="font-mono text-[11px] tabular-nums text-faint">
        {score.toFixed(3)}
      </span>
    </div>
  );
}

export default function AskSite() {
  /* Built once; the corpus is static. */
  const index = useMemo(() => buildIndex(corpus), []);

  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [asked, setAsked] = useState("");
  const [running, setRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const run = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setAsked(trimmed);
    setRunning(true);

    /* The search itself is sub-millisecond. The short pause is so the pipeline
       is legible — the timings reported below are the real measured ones. */
    const outcome = search(index, trimmed, { topK: 3, threshold: THRESHOLD });
    window.setTimeout(() => {
      setResult(outcome);
      setRunning(false);
    }, 420);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    run(query);
    /* Make the question shareable without reloading the page. */
    const url = new URL(window.location.href);
    url.searchParams.set("q", query.trim());
    window.history.replaceState({}, "", url);
  };

  /* ?q=… runs that question on load, so a result can be linked to directly. */
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("q");
    if (!asked) return;
    setQuery(asked);
    run(asked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="ask"
      className="scroll-mt-14 py-12 lg:py-16"
    >
      <div className="shell">
        <Reveal className="max-w-3xl">
          <p className="label flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Try it
          </p>
          <Heading text="Ask this site a question." className="display mt-4 max-w-[12ch]" />
          <p className="mt-5 max-w-xl text-[0.9rem] leading-[1.75] text-muted">
            A retrieval engine running in your browser over this page&apos;s own
            content. It shows you the passages it found and what it scored
            them — and when nothing scores highly enough, it says so instead of
            guessing.
          </p>
        </Reveal>

        <Reveal className="mt-6" delay={0.08}>
          <form onSubmit={onSubmit}>
            <div className="group relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[16px] w-[16px] -translate-y-1/2 text-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="What have you built with RAG?"
                aria-label="Ask a question about this site"
                className="w-full border border-line bg-transparent py-4 pl-12 pr-36 font-display text-[0.98rem] outline-none transition-colors duration-300 placeholder:text-faint focus:border-fg"
              />
              <button
                type="submit"
                className="label absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 border border-line px-3.5 py-2.5 transition-colors hover:!text-fg"
              >
                Search
                <CornerDownLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => {
                  setQuery(question);
                  run(question);
                }}
                className="tag transition-colors duration-200 hover:!text-fg hover:border-fg"
              >
                {question}
              </button>
            ))}
          </div>

          {/* ---------------- Results ---------------- */}
          {(running || result) && (
            <div className="mt-8 overflow-hidden border border-line">
              {/* Pipeline header */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line px-5 py-3.5">
                {["tokenise", "score", "rank", "threshold"].map(
                  (stage, position) => (
                    <span
                      key={stage}
                      className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 ${
                        running ? "text-faint" : "text-fg"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 transition-colors duration-300 ${
                          running ? "bg-line" : "bg-fg"
                        }`}
                        style={{ transitionDelay: `${position * 90}ms` }}
                      />
                      {stage}
                    </span>
                  )
                )}

                {result && !running && (
                  <span className="ml-auto font-mono text-[11px] tabular-nums text-faint">
                    {result.stats.passages} passages ·{" "}
                    {result.timings.total < 0.01
                      ? "<0.01"
                      : result.timings.total.toFixed(2)}{" "}
                    ms
                  </span>
                )}
              </div>

              <div className="p-5">
                {running && (
                  <p className="py-6 text-center font-mono text-[12px] text-faint">
                    Retrieving…
                  </p>
                )}

                {!running && result && result.refused && (
                  <div className="flex gap-4 py-2">
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <div>
                      <p className="text-[15px] font-semibold">
                        Not enough context to answer that.
                      </p>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted">
                        Nothing in this index scored above the{" "}
                        <span className="font-mono text-[13px]">
                          {THRESHOLD}
                        </span>{" "}
                        similarity threshold, so the honest answer is that I
                        don&apos;t know — this index only covers my work.
                        {result.hits.length > 0 && (
                          <>
                            {" "}
                            The closest passage scored{" "}
                            <span className="font-mono text-[13px]">
                              {result.hits[0].score.toFixed(3)}
                            </span>
                            .
                          </>
                        )}
                      </p>
                      <p className="mt-3 text-[13px] text-faint">
                        This is the behaviour that matters most in a production
                        RAG system, and the one most demos skip.
                      </p>
                    </div>
                  </div>
                )}

                {!running && result && !result.refused && (
                  <div className="space-y-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                      Top {result.hits.length} for “{asked}”
                    </p>

                    {result.hits.map((hit, position) => (
                      <article
                        key={hit.passage.id}
                        className="border border-line p-4"
                        style={{
                          animation: `riseIn .5s cubic-bezier(.22,1,.36,1) ${
                            position * 80
                          }ms both`,
                        }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <a
                            href={hit.passage.href ?? "#top"}
                            className="ul-link label !text-fg"
                          >
                            {hit.passage.source}
                          </a>
                          <ScoreBar score={hit.score} />
                        </div>
                        <p className="mt-2.5 text-[14px] leading-[1.7] text-muted">
                          <Highlighted
                            text={hit.passage.text}
                            terms={hit.matched}
                          />
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Honest footnote about what this actually is. */}
              <p className="border-t border-line px-5 py-3 font-mono text-[11px] leading-relaxed text-faint">
                TF-IDF + cosine similarity, computed on your device. Production
                systems I build use sentence-transformers and Qdrant — the
                pipeline shape is the same, the vectors are better.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

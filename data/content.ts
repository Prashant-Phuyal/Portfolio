/**
 * Every word on the site lives here.
 *
 * Facts come from ER_PRASHANT_CV.pdf and from reading the repositories while
 * they were public. The phrasing is first-person and plain — no slogans.
 *
 * Attribution rule: these are team products. Prashant built the AI layer; the
 * apps, platforms and infrastructure around them were built by other
 * developers. Every project says so in its `credit` line. Never write a
 * whole-repo fact (architecture, Docker, CI, test suites) as if it were his.
 */

export const profile = {
  name: "Prashant Phuyal",
  honorific: "Er.",
  firstName: "Prashant",
  lastName: "Phuyal",
  nameNepali: "प्रशान्त फुयाल",
  role: "AI Engineer",
  title: "Associate AI Engineer at Dome Infosys",
  location: "Kathmandu, Nepal",
  email: "prashantphuyal7@gmail.com",
  /* Dialable form for tel: links; `display` is what the page shows. */
  phones: [
    { display: "+977 9813977198", dial: "+9779813977198" },
    { display: "+977 9840723272", dial: "+9779840723272" },
  ],
  github: "https://github.com/Prashant-Phuyal",
  linkedin: "https://www.linkedin.com/in/prashant-phuyal-a27120215/",
  facebook: "https://www.facebook.com/prashant.phuyal.948/",
  instagram: "https://www.instagram.com/prashant_phuyal10/",
  siteUrl: "https://prashantphuyal.com.np",
  cv: "/ER_PRASHANT_CV.pdf",
  /**
   * Drop a photo at public/prashant.jpg and it appears automatically.
   * Until then the hero shows a monogram. A square image works best.
   */
  photo: "/prashant.jpg",
  blurb:
    "AI engineer in Kathmandu building retrieval-augmented chatbots and generative AI features at Dome Infosys.",
  pitch:
    "I build the parts of a product that have to understand something — chatbots that answer from a company's own documents, and the generative AI features behind them.",
  available: "Open to AI engineering roles",
};

/** Hero counters. Each one is checkable against the CV. */
export const stats = [
  { value: 1, suffix: "+", label: "Year at Dome Infosys" },
  { value: 9, suffix: "", label: "AI domains shipped" },
  { value: 8, suffix: "", label: "Client AI assistants" },
  { value: 3, suffix: "", label: "Languages supported" },
];

export const about = [
  "I'm an AI engineer at Dome Infosys in Kathmandu, where I started as an intern a little over a year ago and now work across our clients' AI features.",
  "Most of my work is retrieval-augmented generation, which in practice is less about prompting than about everything around it: parsing the files people actually have, chunking them so a search can find the right passage, and deciding when the retrieved context is too thin to answer at all. The last one matters most. A model that invents a plausible answer about IVF treatment is worse than one that says it doesn't know.",
  "Before that I spent four years on a computer engineering degree, most of it on computer vision — object detection and OCR for Nepali, which has far less training data available than English does.",
];

export const marquee = [
  "RAG",
  "FastAPI",
  "Qdrant",
  "LangChain",
  "Gemini",
  "OpenAI",
  "LangGraph",
  "FAISS",
  "PostgreSQL",
  "Redis",
  "MongoDB",
  "Celery",
  "PyTorch",
  "TensorFlow",
  "Faster R-CNN",
  "YOLO",
  "OpenCV",
  "EasyOCR",
  "LiveKit",
  "Pydantic",
];

export const experience = {
  company: "Dome Infosys",
  location: "Kathmandu, Nepal",
  role: "Associate AI Engineer",
  note: "Promoted from AI/ML Intern",
  period: "More than 1 year",
  summary:
    "I design, build and deploy production RAG chatbots and generative AI features for clients across healthcare, education, travel, recruitment, retail and financial services.",
  points: [
    "Own end-to-end RAG pipelines — ingestion, chunking, embeddings, Qdrant and FAISS indexing, top-K retrieval, and grounded generation with domain-specific prompts.",
    "Build asynchronous FastAPI backends with conversation persistence in PostgreSQL and MongoDB, Redis caching and rate limiting, and automated deployment through GitHub Actions.",
    "Delivered document-grounded assistants for eight clients, from a fertility clinic to a school to a motors dealership.",
  ],
  clients: [
    "Vatsalya IVF (Ziva)",
    "Babyloan School",
    "YatriFly",
    "Nepwood",
    "Makalu",
    "SewaFund",
    "Rojina Beauty Salon",
    "Pokhara Motors",
  ],
};

export type Project = {
  slug: string;
  name: string;
  context: string;
  sector: string;
  period: string;
  /** One line summary for the card header. */
  summary: string;
  /** The idea worth remembering, pulled out large. */
  pull: string;
  story: string[];
  /** Who built the rest — rendered plainly, never hidden. */
  credit: string;
  stack: string[];
  links?: { label: string; href: string }[];
};

export const work: Project[] = [
  {
    slug: "ziva",
    name: "Ziva",
    context: "IVF assistant for Vatsalya IVF",
    sector: "Healthcare",
    period: "Dome Infosys",
    summary:
      "A fertility assistant that answers from clinic-approved material over text and live voice — and refuses anything outside it.",
    pull: "The whole design is about refusing to answer rather than answering well.",
    story: [
      "Fertility treatment is a subject where a chatbot that improvises is worse than no chatbot at all. A question passes an intent classifier, a domain check and a safety check before anything is retrieved, so an out-of-scope question is turned away before it ever reaches the model. Putting that in the prompt would have been a request; putting it in front is a gate.",
      "Answers come from clinic-approved material retrieved out of Qdrant and fed to Gemini with a prompt constrained to IVF. The knowledge base is built from whatever the clinic already had — PDFs, pages on their website, a YouTube channel, spreadsheets — so there's a parser for each rather than a requirement that someone retype it all.",
      "It also takes phone calls. The voice agent runs on LiveKit, and the part that took longest was barge-in: letting the caller interrupt mid-sentence and having the agent stop talking and listen. Without it you have an IVR menu; with it you have something closer to a conversation.",
    ],
    credit:
      "I built the AI layer — retrieval, the voice agent and the service behind them. The mobile app and surrounding platform were built by fellow developers.",
    stack: [
      "FastAPI",
      "Qdrant",
      "Gemini",
      "OpenAI",
      "LiveKit",
      "PostgreSQL",
      "Redis",
    ],
    links: [
      {
        label: "Ziva Health on the App Store",
        href: "https://apps.apple.com/us/app/ziva-health/id6796605273",
      },
    ],
  },
  {
    slug: "banau",
    name: "Banau.ai",
    context: "AI service for a home-services platform",
    sector: "Home services",
    period: "Dome Infosys",
    summary:
      "Nine AI capabilities behind one HTTP service, consumed by separate CRM, booking and customer products.",
    pull: "Nine features, one router. None of them know which model answered.",
    story: [
      "This one is a separate service rather than a feature. Different teams owned the CRM, the booking system and the customer app, and all three needed AI — so instead of building it into any one of them, I built it as its own service the others call over HTTP.",
      "It covers nine areas: the chatbot, voice calls, damage detection from photos, price estimation, provider matching, provider scoring, review sentiment, fraud and fake-review detection, and analytics write-ups. They vary a lot, but anything involving a model goes through one router — none of them import an LLM SDK directly. Gemini is primary and OpenAI picks up automatically when it fails, and because that switch lives in one place, nine features didn't have to care.",
      "The chatbot works in Nepali first, then English and Hindi. The awkward part is that people write Nepali in Latin letters with no agreed spelling, so a word list for detecting it is hopeless — the same word turns up five ways. It looks at word structure instead.",
    ],
    credit:
      "I built the AI service. The CRM, booking and customer-facing products were built by fellow developers.",
    stack: [
      "FastAPI",
      "Qdrant",
      "FAISS",
      "Gemini",
      "OpenAI",
      "LangChain",
      "PostgreSQL",
      "Redis",
      "Celery",
    ],
  },
  {
    slug: "lekhan",
    name: "LEKHAN AI",
    context: "AI engine for a ghostwriting platform",
    sector: "Publishing",
    period: "In progress",
    summary:
      "Turns interviews, documents and photographs into a book — with a human verifying every fact before anything is drafted.",
    pull: "It's published under a real person's name, so the AI doesn't get the last word.",
    story: [
      "The platform turns interviews, documents and photographs into a book or a biography. The constraint that shapes everything is that it's published under a real person's name, so the AI isn't allowed the final say. It extracts and it drafts; a human checks what's true in between.",
      "Sources are transcribed or read with OCR, then pulled apart into facts. Two people remembering the same event differently is normal in a biography, so the knowledge module looks for contradictions and surfaces them rather than quietly picking one. Only after someone has verified the material does anything get drafted into chapters.",
      "It's also the first thing I've built with a proper evaluation setup — test cases in English and Nepali with metrics attached, so when I change a prompt I can tell whether it got better or just different. I should have been doing that earlier.",
    ],
    credit:
      "I built the AI engine. The platform around it was built by fellow developers.",
    stack: [
      "FastAPI",
      "Celery",
      "Qdrant",
      "Gemini",
      "PostgreSQL",
      "Redis",
      "Pytest",
    ],
  },
  {
    slug: "jobscater",
    name: "Jobscater",
    context: "Generative AI for a job platform",
    sector: "Recruitment",
    period: "Dome Infosys",
    summary:
      "Job posts generated from a few words, and a CV maker that scores like an ATS and explains what's wrong.",
    pull: "A score alone is useless. The explanation is the product.",
    story: [
      "Two sides of the same problem: employers write thin job posts because writing a full one is tedious, and candidates get filtered out by applicant tracking systems without ever being told why.",
      "For employers, a few words about a role expand into skills, keywords, responsibilities and a full specification. For candidates, the CV maker writes a summary, suggests skills, scores the CV the way an ATS would and explains what's dragging the score down — then generates interview questions from what's actually in their CV.",
      "None of it is a chat window, so the output has to be valid structured JSON every time rather than prose that happens to parse. That turned out to be most of the work.",
    ],
    credit:
      "I built the AI APIs. The web platform and mobile apps were built by fellow developers.",
    stack: ["Python", "FastAPI", "LLM APIs", "Structured JSON"],
    links: [
      {
        label: "Jobscater on the App Store",
        href: "https://apps.apple.com/us/app/jobscater/id6752475070",
      },
    ],
  },
];

export type SideProject = {
  name: string;
  kind: string;
  summary: string;
  stack: string[];
  href?: string;
  note?: string;
};

export const side: SideProject[] = [
  {
    name: "KnowledgePilot",
    kind: "Generative AI",
    summary:
      "A question-answering API over your own documents, with citations and a small chat UI. It's where I worked out the thing I now put in everything: if the retrieved passages score below a threshold, say you don't know rather than generate from weak context.",
    stack: ["FastAPI", "LangChain", "Qdrant", "Streamlit"],
    href: "https://github.com/Prashant-Phuyal/Nepa_work-Rag-",
  },
  {
    name: "Traffic sign detection for Nepal",
    kind: "Computer Vision",
    summary:
      "My final-year project — a Faster R-CNN model recognising nine kinds of Nepalese traffic sign. No public dataset exists for these, so most of the work was collecting and annotating photographs rather than training.",
    stack: ["TensorFlow", "Keras", "OpenCV"],
    href: "https://github.com/Prashant-Phuyal/Traffic-Sign-Detection-in-Nepal-Using-Rcnn",
  },
  {
    name: "Nepali OCR",
    kind: "Computer Vision",
    summary:
      "Reading Devanagari and English off scanned documents. EasyOCR does badly on a raw scan of Devanagari; nearly all the accuracy came from the OpenCV preprocessing in front of it.",
    stack: ["EasyOCR", "OpenCV"],
    href: "https://github.com/Prashant-Phuyal/Nepali-OCR-",
  },
  {
    name: "School chatbot",
    kind: "Generative AI",
    summary:
      "Notices and FAQs answered from a school's own documents, delivered as a widget they drop into their existing site with one script tag. Built for a client at Dome Infosys.",
    stack: ["FastAPI", "FAISS", "RAG"],
    note: "Source not public",
  },
];

export const skills = [
  {
    group: "Generative AI & LLM",
    items: [
      "RAG",
      "Prompt Engineering",
      "AI Chatbots",
      "Voice AI Agents",
      "Intent Classification",
      "Conversation Memory",
      "Structured JSON Output",
      "LangChain",
      "LangGraph",
      "Gemini",
      "OpenAI",
      "HuggingFace",
    ],
  },
  {
    group: "Vector Search & Retrieval",
    items: [
      "Qdrant",
      "FAISS",
      "Embeddings",
      "Semantic Search",
      "Document Ingestion",
      "Chunking",
      "Top-K Retrieval",
      "sentence-transformers",
    ],
  },
  {
    group: "Backend & APIs",
    items: [
      "Python",
      "FastAPI",
      "Async Python",
      "Pydantic",
      "REST Design",
      "SQLAlchemy",
      "Celery",
      "JWT Auth",
      "Rate Limiting",
      "GitHub Actions",
      "Pytest",
    ],
  },
  {
    group: "ML & Computer Vision",
    items: [
      "PyTorch",
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "Faster R-CNN",
      "YOLO",
      "Vision LLMs",
      "OpenCV",
      "EasyOCR",
    ],
  },
  {
    group: "Databases & Data Analysis",
    items: [
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "SQL",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "EDA",
    ],
  },
];

export const education = {
  degree: "Bachelor in Computer Engineering",
  school: "Cosmos College of Management & Technology",
  location: "Kathmandu, Nepal",
  period: "2021 – 2025",
  grade: "CGPA 3.6 / 4.0",
  certification: "Data Science with Python",
  languages: [
    { name: "Nepali", level: "Native" },
    { name: "English", level: "Professional" },
    { name: "Hindi", level: "Conversational" },
  ],
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Ask", href: "#ask" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

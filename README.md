# prashantphuyal.com.np

Personal site for **Prashant Phuyal** — AI engineer, Kathmandu.

Next.js 14 · TypeScript · Tailwind. One page, one column, no JavaScript beyond
what Next ships by default.

---

## Run it

> **This is a Node.js project, not Python.** There is no `requirements.txt`,
> no `venv`, and no `pip`. Dependencies live in a local `node_modules/` folder
> inside the project, so it is already isolated — there is no virtual
> environment to create or activate.

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
cd prashant-portfolio   # the project folder, not the one above it
npm install             # once
npm run dev             # → http://localhost:3001
```

`Ctrl+C` to stop. Before deploying, check the real build:

```bash
npm run build
npm run start
```

### Coming from Python

| Python | Here |
| --- | --- |
| `requirements.txt` | `package.json` |
| `pip install -r requirements.txt` | `npm install` |
| `venv/` | `node_modules/` (automatic, per-project) |
| `source venv/bin/activate` | nothing to activate |
| `python main.py` | `npm run dev` |

---

## How it's built

```
app/
  layout.tsx      fonts, metadata, and the inline theme script
  page.tsx        assembles the sections; resolves the photo on the server
  globals.css     colour tokens for both themes, animations, component classes
components/       Nav, Hero, About, Work, Experience, Contact, Motion, ThemeToggle
data/content.ts   every word on the page
lib/photo.ts      finds your photo in public/ at build time
```

### The design language

Editorial and typographic, following the house style of the portfolios
collected on [siteinspire](https://www.siteinspire.com/websites/category/portfolio):
display type as the main visual element, near-monochrome, hairline rules, and
work presented as a numbered index rather than a grid of cards.

Concretely, that means:

- **Type carries the page.** The name runs at `clamp(2.9rem, 13.2vw, 13rem)`
  in Bricolage Grotesque, tracking pulled to `-0.045em`. The face was chosen
  over a neutral grotesk deliberately: at 13rem, Helvetica-alikes have no
  character to show, and the name *is* the hero. Instrument Serif italic
  carries the "Er." honorific and occasional emphasis.
- **Two colours and a hairline.** Everything is `--fg` on `--bg` with
  `--line` for rules. The accent is used in tiny amounts, for interaction only.
- **No shadows, no pills, no rounded cards.** Borders are 1px and corners are
  square. A card with a drop shadow reads as a SaaS marketing page.
- **Work is an index.** Numbered rows that expand in place, so the whole body
  of work stays readable at a glance.
- **Mono for the UI voice.** Labels, tags and buttons are uppercase JetBrains
  Mono at ~11px with wide tracking. Everything else is the display face.
- **Texture.** A fixed film grain at 5.5% opacity keeps large flat areas from
  reading as dead pixels. (A custom cursor ring was tried and removed — it
  fought the native cursor for no real gain.)
- **Motion.** Section headings reveal word by word (`components/Heading.tsx`),
  index rows wipe a fill upward on hover and shift right, tag clusters stagger
  in, buttons pull slightly toward the pointer (`components/Magnetic.tsx`), the
  portrait parallaxes and desaturates until hover, counters count up, and the
  tech band surges with scroll velocity. Everything respects
  `prefers-reduced-motion`, and nothing gates content visibility on JavaScript.
- **The name decodes on load** (`components/DecodeText.tsx`) — a nod to the
  retrieval work. The real text is server-rendered and the scramble only ever
  replaces already-correct text, so it degrades to a plain, correct name.
- **Keep the rhythm tight.** Sections are `py-16 lg:py-24`, headings top out at
  `3.6rem` and the name at `9.5rem`. An earlier pass ran roughly 40% larger and
  the page read as mostly whitespace.

If you extend the page, keep to that. The quickest way to break it is to add a
rounded, shadowed card with a saturated accent colour.

### The retrieval demo

`#ask` is a working retrieval engine over this site's own content — the piece
that makes this portfolio worth looking at, because it demonstrates the skill
instead of describing it.

- **`lib/retrieval.ts`** — TF-IDF with cosine similarity. No dependencies, no
  network. Pure functions, so it can be tested from Node.
- **`data/corpus.ts`** — the searchable passages, derived from `content.ts`, so
  the index can never drift from what the page actually says.
- **`components/AskSite.tsx`** — the UI: ranked passages, similarity scores,
  matched-term highlighting, real measured timings.

**The refusal is the point.** When the best match falls below the similarity
threshold (`0.08`), the engine says it cannot answer instead of returning its
best bad guess. Try *"What is your favourite colour?"*. That behaviour is what
separates a production RAG system from a demo, and it is the thing most demos
skip.

It is deliberately honest about what it is: lexical retrieval, not embeddings.
Shipping a real embedding model would mean megabytes of download for a
portfolio page. The footnote under the results says so.

`?q=your+question` runs a query on load, so a result can be linked to directly.

To sanity-check it after changing content, run a few queries from Node:

```bash
npx tsx -e "import {buildIndex,search} from './lib/retrieval'; import {corpus} from './data/corpus'; const i=buildIndex(corpus); for (const q of ['qdrant','pizza recipe']) console.log(q, search(i,q).refused ? 'REFUSED' : 'answered')"
```

Two gotchas already fixed, worth not reintroducing: the stemmer must map
`study` and `studied` to the same token, and conversational filler like "know"
belongs in the stopword list — otherwise *"do you know kubernetes?"* matches on
"know" and answers confidently about a technology that isn't in the corpus.

### The command palette

⌘K / Ctrl-K opens `components/CommandPalette.tsx` — jump to a section, copy the
email, download the CV, open GitHub or LinkedIn, toggle the theme. Fully
keyboard-driven with arrow keys and Enter.

### Your photo

Drop a square-ish image into `public/` named **`prashant.jpg`** (`.png`,
`.jpeg` and `.webp` also work, as does `profile.jpg`). It is picked up
automatically — no code change. Until then the hero shows a monogram.

The lookup runs on the server in `lib/photo.ts` rather than in the browser,
because an `<img>` pointing at a missing file paints a broken-image icon before
any `onError` handler can replace it.

### Light and dark

An inline script in `layout.tsx` sets `data-theme` on `<html>` before the first
paint, so the page never flashes the wrong theme. A saved choice wins; failing
that it follows the operating system. The toggle sits in the header and writes
to `localStorage`.

All colours are CSS variables at the top of `globals.css` — change them in one
place and both themes follow.

### Motion, and the rule behind it

**Nothing on this page is invisible unless JavaScript is running.**

That rule exists because it was broken twice during the build: hero elements
and whole sections started at `opacity: 0` waiting for a script, and when that
script was slow the page rendered blank.

How it works now:

- **The hero** animates with CSS keyframes, which always complete.
- **Scroll reveals** are hidden only under a `.js` class that the inline script
  adds before first paint. No script, no hiding — the page is simply static.
- **Every reveal has a safety timeout**, so a misfiring IntersectionObserver
  can't strand a section either.
- **The counters** render their final number server-side and only then animate,
  so they read correctly even if hydration never happens.

If you add animation, follow the same rule. Never ship an element whose resting
state is invisible and whose only way out is JavaScript.

> One gotcha worth remembering: the `.rise` animation ends at
> `transform: none`, which cancels Tailwind transforms like `-translate-x-1/2`.
> Put positioning on an outer element and the animation on an inner one.

## Editing the content

Everything comes from [`data/content.ts`](data/content.ts):

| Export | What it is |
| --- | --- |
| `profile` | Name, role, contact links, CV path |
| `intro` | The opening paragraphs |
| `work` | The four production systems |
| `side` | Smaller projects |
| `tools` | The three "what I use" sentences |
| `background` | Education, certification, languages |

**A new claim goes on the CV first, then here.** That ordering is what keeps the
site, the CV and [`PROJECTS.md`](PROJECTS.md) from drifting apart.

### The attribution rule

Prashant engineered the AI layer on these products. Apps, platforms,
infrastructure, CI and test suites were built by other developers. Never write
a whole-repo fact — architecture, Docker, deploy pipelines, test coverage — as
if it were his.

---

## The CV

The real PDF is at [`public/ER_PRASHANT_CV.pdf`](public/ER_PRASHANT_CV.pdf),
served at `/ER_PRASHANT_CV.pdf`. When it is updated, replace that file and keep
the filename — every download link keeps working.

---

## Is this site static or dynamic?

**Static.** Every page is rendered once at build time into plain HTML, CSS and
JavaScript — the build output reports `○ (Static) prerendered as static
content`. There is no server, no database, no API route, and nothing is
rendered per request.

Everything interactive runs **in the visitor's browser**:

| Feature | Where it runs |
| --- | --- |
| Theme toggle | Browser, remembered in `localStorage` |
| Command palette (⌘K) | Browser |
| "Ask this site" retrieval | Browser — index built from data bundled at build time |
| Kathmandu clock | Browser |
| Photo lookup, CV | Resolved at build time |

That is why it can run on GitHub Pages at all, and why it is fast and free to
host.

**What a static site cannot do:** accept a contact-form submission, show live
data, or call an LLM with a secret API key — each needs a server. If you ever
want the Ask box backed by a real model instead of local retrieval, that is the
point where you would add an API route and deploy to Vercel. The components
would barely change, but the site would stop being purely static.

---

## Deploying

### GitHub Pages — configured and ready

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and
publishes on every push to `main`.

```bash
git add -A
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/Prashant-Phuyal/<repo>.git
git push -u origin main
```

Then once, in the repo: **Settings → Pages → Build and deployment → Source →
GitHub Actions**. The next push publishes.

Two details are already handled:

- `public/CNAME` holds `prashantphuyal.com.np`, so Pages keeps the custom
  domain across deploys.
- `public/.nojekyll` stops Pages discarding the `_next` folder — it ignores
  directories starting with an underscore otherwise, which would break every
  stylesheet and script.

At your registrar, point the domain at Pages: four `A` records on `@` to
`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
and a `CNAME` on `www` to `Prashant-Phuyal.github.io`. Then tick **Enforce
HTTPS**.

> Publishing to `<user>.github.io/<repo>/` rather than a custom domain? Set
> `BASE_PATH: "/<repo>"` in the workflow, or every asset URL will 404.

### Vercel

Import the repository at [vercel.com/new](https://vercel.com/new), then
**Settings → Domains → Add**. No configuration needed: `BUILD_TARGET` is unset
there, so it runs an ordinary Next build.

### Building the static files locally

```bash
BUILD_TARGET=static npm run build   # writes ./out
npx serve out                       # preview exactly what Pages will serve
```

On Windows PowerShell: `$env:BUILD_TARGET="static"; npm run build`.

Canonical URL, Open Graph tags and the `Person` JSON-LD in `app/layout.tsx`
already point at `https://prashantphuyal.com.np`.

---

## Still to do

- **Put LEKHAN AI on the CV.** It is on the site from the repository alone, and
  it is strong work — an eval framework, contradiction detection, per-job
  workers.
- A share image at `public/og.png` (1200×630), then add `images: ["/og.png"]`
  to the `openGraph` block in `app/layout.tsx`.
- Possibly a photo. The page is all text, which suits it, but one good
  photograph at the top would not hurt.

---

See [`PROJECTS.md`](PROJECTS.md) for the long-form record of every project,
including the detail read out of the repositories before they went private.

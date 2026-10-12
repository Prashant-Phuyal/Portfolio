import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Nav from "../../components/Nav";
import Contact from "../../components/Contact";
import { ScrollProgress } from "../../components/Motion";
import { profile, side, work } from "../../data/content";

/* The index that gives the project pages somewhere to be linked from, and
   gives search engines a single crawlable list of the work. */

export const metadata: Metadata = {
  title: "AI Engineering Projects — RAG, LLMs & Computer Vision",
  description:
    "Production AI systems built by Prashant Phuyal: RAG chatbots, voice AI, " +
    "LLM applications and computer vision, using FastAPI, Qdrant, Gemini and PyTorch.",
  alternates: { canonical: "/projects/" },
  openGraph: {
    type: "website",
    url: `${profile.siteUrl}/projects/`,
    title: "AI Engineering Projects | Prashant Phuyal",
    description:
      "Production AI systems: RAG chatbots, voice AI, LLM applications and computer vision.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Prashant Phuyal — AI engineering projects" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${profile.siteUrl}/` },
        { "@type": "ListItem", position: 2, name: "Projects", item: `${profile.siteUrl}/projects/` },
      ],
    },
    {
      "@type": "CollectionPage",
      name: "AI Engineering Projects",
      url: `${profile.siteUrl}/projects/`,
      about: { "@id": `${profile.siteUrl}/#person` },
      inLanguage: "en",
      hasPart: work.map((project) => ({
        "@type": "Article",
        headline: `${project.name} — ${project.context}`,
        description: project.summary,
        url: `${profile.siteUrl}/projects/${project.slug}/`,
      })),
    },
  ],
};

export default function ProjectsIndex() {
  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="main">
        <div className="shell pt-20 lg:pt-24">
          <nav aria-label="Breadcrumb" className="border-b border-line pb-3">
            <ol className="flex flex-wrap items-center gap-2 text-[0.8rem] text-muted">
              <li>
                <Link href="/" className="ul-link hover:text-fg">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-fg">
                Projects
              </li>
            </ol>
          </nav>

          <header className="mt-8">
            <h1
              className="font-display font-semibold tracking-[-0.035em]"
              style={{ fontSize: "clamp(2.1rem, 6vw, 4rem)", lineHeight: 0.98 }}
            >
              AI engineering projects
            </h1>
            <p className="mt-4 max-w-2xl text-[1rem] leading-[1.7] text-muted">
              Production Generative AI systems built at Dome Infosys, plus
              personal and academic work in retrieval, computer vision and OCR.
              Each production project names the part I engineered and who built
              the rest.
            </p>
          </header>

          {/* ---- production systems, each with its own page ---- */}
          <section aria-labelledby="production" className="mt-14">
            <h2 id="production" className="text-[1.3rem] font-semibold tracking-[-0.02em]">
              Production systems
            </h2>

            <ul className="mt-5 border-t border-line">
              {work.map((project, index) => (
                <li key={project.slug} className="border-b border-line">
                  <Link
                    href={`/projects/${project.slug}/`}
                    className="row-wipe group flex items-start gap-5 px-2 py-6 sm:gap-7"
                  >
                    <span className="label mt-1.5 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h3 className="font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-1.5 lg:text-[2rem]">
                          {project.name}
                        </h3>
                        <span className="label">{project.sector}</span>
                      </span>
                      <span className="mt-2 block max-w-2xl text-[0.92rem] leading-relaxed text-muted">
                        {project.summary}
                      </span>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {project.stack.slice(0, 6).map((tech) => (
                          <span key={tech} className="tag">
                            {tech}
                          </span>
                        ))}
                      </span>
                    </span>
                    <ArrowUpRight className="mt-1.5 h-5 w-5 shrink-0 text-faint transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-fg" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* ---- smaller work, described in full here rather than on thin pages ---- */}
          <section aria-labelledby="personal" className="mt-16">
            <h2 id="personal" className="text-[1.3rem] font-semibold tracking-[-0.02em]">
              Personal &amp; academic work
            </h2>

            <ul className="mt-5 grid gap-px border-t border-line bg-line md:grid-cols-2">
              {side.map((project) => (
                <li key={project.name} className="bg-bg p-6">
                  <p className="label">{project.kind}</p>
                  <h3 className="mt-3 font-display text-[1.2rem] font-semibold tracking-[-0.02em]">
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="ul-link"
                      >
                        {project.name}
                      </a>
                    ) : (
                      project.name
                    )}
                  </h3>
                  <p className="mt-2.5 text-[0.92rem] leading-[1.75] text-muted">
                    {project.summary}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <li key={tech} className="tag">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <Contact />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}

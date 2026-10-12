import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Nav from "../../../components/Nav";
import Contact from "../../../components/Contact";
import { ScrollProgress } from "../../../components/Motion";
import { profile, work } from "../../../data/content";

/*
  One page per production project.

  These exist because each carries several hundred words of specific technical
  detail — the retrieval pipeline, the provider routing, the verification step.
  That is the kind of content search engines can actually rank for technical
  queries, and it was previously collapsed behind a button on the homepage.

  Only the four production systems get pages. The smaller projects stay on the
  homepage: a page per two-sentence project would be a thin page, which helps
  nobody.
*/

export function generateStaticParams() {
  return work.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = work.find((entry) => entry.slug === params.slug);
  if (!project) return {};

  const title = `${project.name} — ${project.context}`;
  /* Kept near 155 characters so Google shows it whole rather than truncating. */
  const tech = project.stack.slice(0, 3).join(", ");
  const base = `${project.name}: ${project.summary}`;
  const suffix = ` Built with ${tech} by Prashant Phuyal.`;
  const room = 158 - suffix.length;
  const description =
    (base.length > room ? `${base.slice(0, room - 1).trimEnd()}…` : base) +
    suffix;
  const url = `${profile.siteUrl}/projects/${project.slug}/`;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}/` },
    openGraph: {
      type: "article",
      url,
      title: `${title} | Prashant Phuyal`,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Prashant Phuyal`,
      description,
      images: ["/og.png"],
    },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = work.find((entry) => entry.slug === params.slug);
  if (!project) notFound();

  const index = work.findIndex((entry) => entry.slug === project.slug);
  const next = work[(index + 1) % work.length];
  const url = `${profile.siteUrl}/projects/${project.slug}/`;

  /* Breadcrumbs are rendered visibly below, so the markup is honest. */
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${profile.siteUrl}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: `${profile.siteUrl}/projects/`,
          },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
      {
        "@type": "Article",
        headline: `${project.name} — ${project.context}`,
        description: project.summary,
        author: { "@id": `${profile.siteUrl}/#person` },
        publisher: { "@id": `${profile.siteUrl}/#person` },
        mainEntityOfPage: url,
        about: project.stack,
        inLanguage: "en",
      },
    ],
  };

  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="main">
        <article className="pt-20 lg:pt-24">
          <div className="shell">
            {/* ---- breadcrumbs ---- */}
            <nav aria-label="Breadcrumb" className="border-b border-line pb-3">
              <ol className="flex flex-wrap items-center gap-2 text-[0.8rem] text-muted">
                <li>
                  <Link href="/" className="ul-link hover:text-fg">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/projects/" className="ul-link hover:text-fg">
                    Projects
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-fg">
                  {project.name}
                </li>
              </ol>
            </nav>

            {/* ---- title ---- */}
            <header className="mt-8">
              <p className="label">
                {project.sector} · {project.period}
              </p>
              <h1
                className="mt-3 font-display font-semibold tracking-[-0.035em]"
                style={{
                  fontSize: "clamp(2.2rem, 6.5vw, 4.5rem)",
                  lineHeight: 0.95,
                }}
              >
                {project.name}
              </h1>
              <p className="mt-3 text-[1.05rem] text-muted lg:text-[1.2rem]">
                {project.context}
              </p>
            </header>

            {/* ---- body ---- */}
            <div className="mt-10 grid gap-10 border-t border-line pt-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <p className="text-[1.1rem] leading-[1.5] lg:text-[1.3rem]">
                  {project.summary}
                </p>

                <p className="mt-7 border-l-2 border-accent pl-5 text-[1.1rem] italic leading-snug text-muted">
                  {project.pull}
                </p>

                <h2 className="mt-10 text-[1.3rem] font-semibold tracking-[-0.02em]">
                  How it works
                </h2>
                <div className="mt-4 space-y-4">
                  {project.story.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[0.97rem] leading-[1.8] text-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <aside className="lg:col-span-4 lg:col-start-9">
                <h2 className="text-[0.95rem] font-semibold">My role</h2>
                <p className="mt-2.5 text-[0.92rem] leading-relaxed text-muted">
                  {project.credit}
                </p>

                <h2 className="mt-8 text-[0.95rem] font-semibold">
                  Technologies
                </h2>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li key={tech} className="tag">
                      {tech}
                    </li>
                  ))}
                </ul>

                {project.links && project.links.length > 0 && (
                  <>
                    <h2 className="mt-8 text-[0.95rem] font-semibold">Links</h2>
                    <ul className="mt-2.5 space-y-2">
                      {project.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="ul-link inline-flex items-center gap-1.5 text-[0.9rem]"
                          >
                            {link.label}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </aside>
            </div>

            {/* ---- onward links ---- */}
            <nav
              aria-label="More projects"
              className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-6"
            >
              <Link
                href="/projects/"
                className="ul-link inline-flex items-center gap-2 text-[0.95rem]"
              >
                <ArrowLeft className="h-4 w-4" />
                All AI engineering projects
              </Link>
              <Link
                href={`/projects/${next.slug}/`}
                className="ul-link inline-flex items-center gap-2 text-[0.95rem]"
              >
                Next: {next.name}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        </article>

        <Contact />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}

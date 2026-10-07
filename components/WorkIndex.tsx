"use client";

import { useState } from "react";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import Heading from "./Heading";
import { Item, Reveal, Stagger } from "./Motion";
import { side, work, type Project } from "../data/content";

/*
  Work as an index, not a grid of cards.

  Each row is a hairline-separated line of display type. Opening a row expands
  it in place, which keeps the whole body of work readable at a glance — the
  pattern most of the portfolios on siteinspire use, and the right one here
  because there are four projects, not forty.
*/

function Row({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="row-wipe group flex w-full items-start gap-4 px-2 py-5 text-left sm:gap-7 lg:py-7"
      >
        {/* Nudged down to sit on the cap-height of the project name. */}
        <span className="label mt-[0.35rem] shrink-0 transition-colors duration-500 group-hover:!text-fg sm:mt-[0.5rem] lg:mt-[0.7rem]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span className="font-display text-[1.6rem] font-medium leading-[0.98] tracking-[-0.035em] transition-transform duration-[520ms] ease-out group-hover:translate-x-2 sm:text-[2.1rem] lg:text-[2.6rem]">
              {project.name}
            </span>
            <span className="label hidden lg:inline">{project.sector}</span>
          </span>
          <span className="mt-2 block max-w-xl text-[0.86rem] leading-relaxed text-muted lg:text-[0.9rem]">
            {project.summary}
          </span>
        </span>

        <span className="mt-[0.2rem] shrink-0 text-faint transition-all duration-500 group-hover:rotate-90 group-hover:text-fg sm:mt-[0.35rem] lg:mt-[0.5rem]">
          {open ? (
            <Minus className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </span>
      </button>

      {/* Expanding detail. Grid-rows trick so it animates to auto height. */}
      <div
        className={`grid transition-all duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid gap-8 pb-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-1" />

            <div className="lg:col-span-6">
              <p className="font-serif text-[1.3rem] italic leading-snug lg:text-[1.55rem]">
                {project.pull}
              </p>
              <div className="mt-5 space-y-3.5">
                {project.story.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[0.92rem] leading-[1.75] text-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <p className="label">Role</p>
              <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">
                {project.credit}
              </p>

              <p className="label mt-7">Built with</p>
              <div className="stagger-tags mt-2.5 flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span key={tech} className="tag">
                    {tech}
                  </span>
                ))}
              </div>

              {project.links && project.links.length > 0 && (
                <div className="mt-7 flex flex-col items-start gap-2">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="ul-link inline-flex items-center gap-1.5 text-[0.88rem]"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function WorkIndex() {
  return (
    <section id="work" className="scroll-mt-14 py-12 lg:py-16">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-4">
            <Heading text="Selected work" className="display" />
            <p className="label">
              {String(work.length).padStart(2, "0")} projects — 2025/26
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-5 max-w-2xl text-[0.9rem] leading-relaxed text-muted">
            These are team products. Each one names the part I engineered and
            who built the rest.
          </p>
        </Reveal>

        <div className="mt-5 border-t border-line">
          {work.map((project, index) => (
            <Row key={project.slug} project={project} index={index} />
          ))}
        </div>

        {/* ---------------- Smaller projects ---------------- */}
        <Reveal className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-4">
            <Heading text="Also built" className="display" />
            <p className="label">Personal &amp; academic</p>
          </div>
        </Reveal>

        <Stagger className="reveal-group mt-7 grid gap-px border-t border-line bg-line md:grid-cols-2">
          {side.map((project) => {
            const linked = Boolean(project.href);
            const Wrapper = linked ? "a" : "div";

            return (
              <Item key={project.name} className="bg-bg">
                <Wrapper
                  {...(linked
                    ? { href: project.href, target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="group flex h-full flex-col p-6 transition-colors duration-500 hover:bg-[color-mix(in_srgb,var(--fg)_3%,transparent)] lg:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="label">{project.kind}</span>
                    {linked ? (
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                    ) : (
                      <span className="label">{project.note}</span>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-[1.25rem] font-medium leading-[1.05] tracking-[-0.03em] transition-transform duration-[520ms] group-hover:translate-x-1.5 lg:text-[1.45rem]">
                    {project.name}
                  </h3>

                  <p className="mt-3 flex-1 text-[0.9rem] leading-[1.75] text-muted">
                    {project.summary}
                  </p>

                  <div className="stagger-tags mt-5 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </Wrapper>
              </Item>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

"use client";

import Heading from "./Heading";
import { Item, Reveal, Stagger } from "./Motion";
import { about, education, experience, skills } from "../data/content";

export default function About() {
  return (
    <>
      {/* ---------------- About ---------------- */}
      <section id="about" className="scroll-mt-14 py-12 lg:py-16">
        <div className="shell">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-4">
              <Heading text="About" className="display" />
              <p className="label">Kathmandu, Nepal</p>
            </div>
          </Reveal>

          <Reveal className="mt-6">
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
              <p className="font-display text-[1.2rem] leading-[1.35] tracking-[-0.02em] lg:col-span-7 lg:text-[1.5rem]">
                {about[0]}
              </p>
              <div className="space-y-3.5 lg:col-span-5">
                {about.slice(1).map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[0.9rem] leading-[1.8] text-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>

          {/*
            The facts run full width in four columns rather than as a tall
            column beside the prose — stacked that way it was twice the height
            of the text and left a hole down the left of the section.
          */}
          <Reveal className="mt-7" delay={0.06}>
            <dl className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
              {[
                { term: "Role", detail: experience.role },
                { term: "Company", detail: experience.company },
                {
                  term: "Since",
                  detail: `${experience.period} · ${experience.note}`,
                },
                { term: "Degree", detail: education.degree },
                {
                  term: "University",
                  detail: `${education.school}, ${education.period}`,
                },
                { term: "Result", detail: education.grade },
                { term: "Certified", detail: education.certification },
                {
                  term: "Languages",
                  detail: education.languages
                    .map((language) => `${language.name} (${language.level})`)
                    .join(", "),
                },
              ].map((row) => (
                <div key={row.term} className="bg-bg py-4 pr-5">
                  <dt className="label">{row.term}</dt>
                  <dd className="mt-1.5 text-[0.86rem] leading-snug">
                    {row.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Experience ---------------- */}
      <section id="experience" className="scroll-mt-14 py-12 lg:py-16">
        <div className="shell">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-4">
              <Heading text="Experience" className="display" />
              <p className="label">{experience.period}</p>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5">
              <h3 className="font-display text-[2rem] font-medium leading-[0.95] tracking-[-0.04em] lg:text-[2.8rem]">
                {experience.company}
              </h3>
              <p className="mt-3 text-[0.95rem] text-muted">
                {experience.role}
              </p>
              <p className="label mt-1.5">{experience.note}</p>

              <p className="label mt-7">Clients served</p>
              <div className="stagger-tags mt-3 flex flex-wrap gap-1.5">
                {experience.clients.map((client) => (
                  <span key={client} className="tag">
                    {client}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.08}>
              <p className="font-display text-[1.2rem] leading-[1.45] tracking-[-0.02em] lg:text-[1.4rem]">
                {experience.summary}
              </p>

              <ul className="mt-8 divide-y divide-line border-y border-line">
                {experience.points.map((point, index) => (
                  <li key={point} className="flex gap-5 py-5">
                    <span className="label shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.92rem] leading-[1.8] text-muted">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Skills ---------------- */}
      <section id="skills" className="scroll-mt-14 py-12 lg:py-16">
        <div className="shell">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-4">
              <Heading text="Capabilities" className="display" />
              <p className="label">As grouped on my CV</p>
            </div>
          </Reveal>

          <Stagger className="reveal-group mt-7 divide-y divide-line border-b border-line">
            {skills.map((group) => (
              <Item key={group.group}>
                <div className="grid gap-3 py-5 lg:grid-cols-12 lg:gap-10">
                  <h3 className="font-display text-[1.15rem] font-medium tracking-[-0.02em] lg:col-span-4 lg:text-[1.4rem]">
                    {group.group}
                  </h3>
                  <div className="stagger-tags flex flex-wrap gap-1.5 lg:col-span-8">
                    {group.items.map((item) => (
                      <span key={item} className="tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

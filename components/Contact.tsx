"use client";

import { ArrowUpRight, Phone } from "lucide-react";
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "./BrandIcons";
import LocalTime from "./LocalTime";
import Heading from "./Heading";
import Magnetic from "./Magnetic";
import { Reveal } from "./Motion";
import { profile } from "../data/content";

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  {
    label: "LinkedIn",
    value: "prashant-phuyal",
    href: profile.linkedin,
    icon: LinkedinIcon,
  },
  {
    label: "GitHub",
    value: "Prashant-Phuyal",
    href: profile.github,
    icon: GithubIcon,
  },
  {
    label: "Instagram",
    value: "prashant_phuyal10",
    href: profile.instagram,
    icon: InstagramIcon,
  },
  {
    label: "Facebook",
    value: "prashant.phuyal.948",
    href: profile.facebook,
    icon: FacebookIcon,
  },
  { label: "Curriculum vitae", value: "PDF, 2 pages", href: profile.cv },
  /* Listed after email and the profiles, which stay the primary route. */
  ...profile.phones.map((phone, index) => ({
    label: index === 0 ? "Phone" : "Alternate",
    value: phone.display,
    href: `tel:${phone.dial}`,
    icon: Phone,
  })),
];

export default function Contact() {
  return (
    <>
      <section id="contact" className="scroll-mt-14 py-12 lg:py-16">
        <div className="shell">
          <Reveal>
            <p className="label">Contact</p>
            {/* Sized explicitly rather than via .display — this is the closing
                statement and carries more weight than a section label. */}
            <Heading
              text="Let's talk."
              className="mt-4 font-display font-medium leading-[0.92] tracking-[-0.04em] text-[clamp(2.4rem,6.5vw,5rem)]"
            />
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mt-6 max-w-xl text-[0.98rem] leading-[1.6] text-muted">
              Open to AI engineering roles, and happy to talk about retrieval,
              grounding, or getting a model to work in a language it{" "}
              <span className="italic text-fg">
                wasn&apos;t really built for
              </span>
              .
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-5 border-t border-line">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  {...(channel.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  {...(channel.href === profile.cv ? { download: true } : {})}
                  className="row-wipe group flex items-center justify-between gap-6 border-b border-line px-2 py-5"
                >
                  <span className="flex min-w-0 items-center gap-5">
                    {channel.icon && (
                      <channel.icon className="h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-fg" />
                    )}
                    <span className="font-display text-[1.25rem] font-medium tracking-[-0.03em] transition-transform duration-[520ms] ease-out group-hover:translate-x-2 lg:text-[1.6rem]">
                      {channel.label}
                    </span>
                  </span>

                  <span className="flex shrink-0 items-center gap-4">
                    <span className="label hidden sm:inline">
                      {channel.value}
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-faint transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-fg" />
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="pb-10 pt-6">
        <div className="shell">
          <div className="flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="label">
              © {new Date().getFullYear()} {profile.name}
            </p>
            <p className="label" lang="ne">
              {profile.nameNepali}
            </p>
            <p className="label">
              Kathmandu — <LocalTime />
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

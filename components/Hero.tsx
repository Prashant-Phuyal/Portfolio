"use client";

import { ArrowDown } from "lucide-react";
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "./BrandIcons";
import LocalTime from "./LocalTime";
import Magnetic from "./Magnetic";
import Marquee from "./Marquee";
import { CountUp, Parallax } from "./Motion";
import { profile, stats } from "../data/content";

/*
  The entrance runs on CSS, not JavaScript: anything whose resting state is
  opacity 0 must not need a script to become visible.
*/

const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

function Portrait({ photo }: { photo: string | null }) {
  if (!photo) {
    return (
      <div className="flex h-full w-full items-center justify-center border border-line">
        <div className="px-4 text-center">
          <p className="label">Portrait</p>
          <p className="mt-1.5 font-mono text-[10px] text-faint">
            public/prashant.jpg
          </p>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo}
      alt={`${profile.name}, ${profile.role}`}
      className="h-full w-full scale-[1.02] object-cover grayscale transition-all duration-[900ms] ease-out hover:scale-100 hover:grayscale-0"
    />
  );
}

export default function Hero({ photo }: { photo: string | null }) {
  return (
    <section id="top" className="relative pt-16 lg:pt-20">
      <div className="shell">
        {/* ---- meta rail ---- */}
        <div
          style={delay(0.05)}
          className="rise flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-3"
        >
          <p className="label">
            {profile.location} — <LocalTime />
          </p>
          <p className="label hidden md:block">{profile.title}</p>
          <p className="label flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {profile.available}
          </p>
        </div>

        {/*
          One typeface, one weight, both lines flush left.

          Three things were wrong before: the honorific was set in a serif
          italic while the name was a grotesk, so a single name carried two
          voices; the second line was right-aligned, which left the right half
          of line one and the left half of line two empty — the worst gap on
          the page; and a decode animation scrambled the letters on load, which
          made the face itself look broken.
        */}
        <h1
          className="mt-5 font-display font-medium tracking-[-0.045em] lg:mt-6"
          style={{ fontSize: "clamp(2.4rem, 8.6vw, 7.5rem)", lineHeight: 0.84 }}
        >
          <span className="line-mask">
            <span style={delay(0.15)} className="block">
              {/* data-text feeds the two torn copies drawn by ::before/::after */}
              <span
                className="glitch"
                data-text={`${profile.honorific} ${profile.firstName}`}
              >
                <span>
                  {profile.honorific} {profile.firstName}
                </span>
              </span>
            </span>
          </span>
          <span className="line-mask">
            <span style={delay(0.24)} className="block">
              <span className="glitch" data-text={profile.lastName}>
                <span>{profile.lastName}</span>
              </span>
            </span>
          </span>
        </h1>

        {/* ---- statement + portrait ---- */}
        {/* items-start, not items-end: the portrait is taller than the
            statement, and bottom-aligning them left a hole under the rule. */}
        <div className="mt-6 grid items-start gap-6 border-t border-line pt-6 lg:mt-7 lg:grid-cols-12 lg:gap-10">
          <div style={delay(0.42)} className="rise lg:col-span-7">
            <p className="max-w-xl font-display text-[1.15rem] leading-[1.32] tracking-[-0.02em] sm:text-[1.4rem] lg:text-[1.65rem]">
              I build the parts of a product that have to{" "}
              <span className="italic">understand something</span> —
              chatbots that answer from a company&apos;s own documents, and the
              generative AI behind them.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Magnetic strength={0.2}>
                <a href="#work" className="btn btn-solid">
                  Selected work
                  <ArrowDown className="h-3.5 w-3.5" />
                </a>
              </Magnetic>
              <Magnetic strength={0.2}>
                <a href={profile.cv} download className="btn">
                  Curriculum vitae
                </a>
              </Magnetic>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                { label: "Email", href: `mailto:${profile.email}` },
                { label: "GitHub", href: profile.github, icon: GithubIcon },
                { label: "LinkedIn", href: profile.linkedin, icon: LinkedinIcon },
                {
                  label: "Instagram",
                  href: profile.instagram,
                  icon: InstagramIcon,
                },
                { label: "Facebook", href: profile.facebook, icon: FacebookIcon },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="ul-link label flex items-center gap-2 !text-fg"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div style={delay(0.52)} className="rise lg:col-span-5">
            <Parallax distance={18}>
              <div className="aspect-[4/5] w-full max-w-[15.5rem] overflow-hidden lg:ml-auto">
                <Portrait photo={photo} />
              </div>
            </Parallax>
          </div>
        </div>

        {/* ---- figures ---- */}
        <dl
          style={delay(0.62)}
          className="rise mt-8 grid grid-cols-2 border-t border-line lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group border-b border-line py-4 pr-5 transition-colors duration-500 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <dt className="font-display text-[2rem] font-medium leading-none tracking-[-0.04em] transition-transform duration-500 group-hover:-translate-y-0.5 lg:text-[2.5rem]">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dt>
              <dd className="label mt-2">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <Marquee />
    </section>
  );
}

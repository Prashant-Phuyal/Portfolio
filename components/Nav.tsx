"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import CommandPalette from "./CommandPalette";
import { nav, profile } from "../data/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Underline whichever section is currently on screen. */
  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.3, 0.6, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-50 transition-all duration-400 ${
        scrolled
          ? "border-b border-line bg-bg/90 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="shell flex h-[72px] items-center justify-between gap-4">
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="font-display text-[15px] font-medium tracking-[-0.02em]">
            Prashant Phuyal
          </span>
          
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`label px-3 py-2 transition-colors ${
                active === item.href ? "!text-fg" : "hover:!text-fg"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <CommandPalette />
          <ThemeToggle />
          <a
            href={profile.cv}
            download
            className="label hidden items-center gap-2 border border-line px-3 py-2 transition-colors hover:!text-fg sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" />
            CV
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center border border-line text-fg md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          <div className="shell flex flex-col py-3">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3.5 font-display text-[1.4rem] tracking-[-0.03em] transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ))}
            <a
              href={profile.cv}
              download
              onClick={() => setOpen(false)}
              className="btn btn-solid mt-5 justify-center"
            >
              <Download className="h-4 w-4" />
              Download CV
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

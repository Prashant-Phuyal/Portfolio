import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/content";

/* Kept out of the index: a 404 has no business appearing in search results. */
export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page does not exist. Browse Prashant Phuyal's AI engineering projects or get in touch.",
  /* No canonical: this page should not consolidate signals onto the homepage. */
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="shell flex min-h-screen flex-col justify-center py-20">
      <p className="label">Error 404</p>

      <h1
        className="mt-4 font-display font-semibold tracking-[-0.04em]"
        style={{ fontSize: "clamp(2.4rem, 9vw, 6rem)", lineHeight: 0.9 }}
      >
        Page not found
      </h1>

      <p className="mt-6 max-w-lg text-[1rem] leading-[1.7] text-muted">
        That address doesn&apos;t exist on this site. It may have been moved, or
        the link that brought you here may be out of date.
      </p>

      <nav aria-label="Where to go instead" className="mt-10 border-t border-line">
        {[
          { href: "/", label: "Home", note: "Portfolio and introduction" },
          {
            href: "/projects/",
            label: "AI engineering projects",
            note: "RAG, LLM applications and computer vision",
          },
          { href: "/#contact", label: "Contact", note: profile.email },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between gap-6 border-b border-line py-5"
          >
            <span>
              <span className="block font-display text-[1.2rem] font-semibold tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-1.5">
                {item.label}
              </span>
              <span className="mt-1 block text-[0.88rem] text-muted">
                {item.note}
              </span>
            </span>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-faint transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-fg" />
          </Link>
        ))}
      </nav>
    </main>
  );
}

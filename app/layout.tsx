import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { profile } from "../data/content";
import "./globals.css";

/*
  One typeface for everything readable.

  This replaced a three-font setup — a quirky display face, a serif used for
  italics, and a mono used for every small label. Three voices at once, with
  the mono set in tracked uppercase across thirty-odd places, is what made the
  page read as generated rather than designed. Inter is ordinary on purpose:
  it is what a professional site actually uses, and it gets out of the way.
*/
const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

/* Kept only for the retrieval demo, where figures and timings genuinely want
   fixed-width digits. Not used for UI labels any more. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: `${profile.name} — ${profile.role}`,
  description: profile.blurb,
  keywords: [
    "AI Engineer",
    "Generative AI",
    "RAG",
    "LLM",
    "FastAPI",
    "Qdrant",
    "Computer Vision",
    "Nepal",
    "Kathmandu",
    profile.name,
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  alternates: { canonical: profile.siteUrl },
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    title: `${profile.name} — ${profile.role}`,
    description: profile.blurb,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.blurb,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1EFEA" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0C0B" },
  ],
};

/**
 * Runs before first paint so the page never flashes the wrong theme.
 * Saved choice wins; otherwise follow the operating system.
 */
const themeScript = `
(function(){
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
  } catch (e) {
    root.setAttribute('data-theme', 'light');
  }
  /* Marks that scripts run, which is what lets CSS hide scroll reveals.
     Without it nothing is hidden, so a blocked script never blanks a section. */
  root.classList.add('js');
})();
`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  description: profile.blurb,
  email: `mailto:${profile.email}`,
  url: profile.siteUrl,
  sameAs: [profile.github, profile.linkedin],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kathmandu",
    addressCountry: "NP",
  },
  worksFor: { "@type": "Organization", name: "Dome Infosys" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Cosmos College of Management & Technology",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}

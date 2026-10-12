import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { education, experience, profile, skills } from "../data/content";
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

/* 64 characters — fits Google's ~600px title budget without truncation. */
const TITLE = "Prashant Phuyal | AI Engineer in Nepal | RAG, Generative AI";

/* 156 characters. States who, what, where and the specialisation, in a
   sentence a human would actually read in a results page. */
const DESCRIPTION =
  "Er. Prashant Phuyal is an Associate AI Engineer in Kathmandu, Nepal, " +
  "building RAG chatbots, LLM applications and Generative AI systems with " +
  "FastAPI and Qdrant.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: TITLE,
    /* Project pages supply their own name; this appends the brand. */
    template: `%s | Prashant Phuyal`,
  },
  description: DESCRIPTION,
  applicationName: profile.name,
  keywords: [
    "Prashant Phuyal",
    "Er. Prashant Phuyal",
    "AI Engineer Nepal",
    "AI Engineer Kathmandu",
    "Associate AI Engineer",
    "Generative AI Engineer Nepal",
    "Machine Learning Engineer Nepal",
    "LLM Engineer",
    "RAG developer",
    "Retrieval-Augmented Generation",
    "AI chatbot developer Nepal",
    "Python",
    "FastAPI",
    "Qdrant",
    "LangChain",
    "Computer Vision",
    "Nepali OCR",
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: profile.siteUrl,
    siteName: profile.name,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Prashant Phuyal — Associate AI Engineer. Generative AI, RAG and LLM applications. Kathmandu, Nepal.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
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

/**
 * One @graph rather than three loose blocks, so Person, WebSite and
 * ProfilePage reference each other by @id and Google reads them as one
 * entity instead of three unrelated claims.
 *
 * Every property below is verifiable from the visible page or the CV. No
 * invented awards, ratings or affiliations.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${profile.siteUrl}/#person`,
      name: profile.name,
      alternateName: `${profile.honorific} ${profile.name}`,
      jobTitle: profile.title,
      description: profile.blurb,
      email: `mailto:${profile.email}`,
      telephone: profile.phones.map((phone) => phone.display),
      url: `${profile.siteUrl}/`,
      image: `${profile.siteUrl}/prashant.jpg`,
      sameAs: [
        profile.github,
        profile.linkedin,
        profile.instagram,
        profile.facebook,
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kathmandu",
        addressCountry: "NP",
      },
      worksFor: {
        "@type": "Organization",
        name: experience.company,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kathmandu",
          addressCountry: "NP",
        },
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: education.school,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Kathmandu",
          addressCountry: "NP",
        },
      },
      /* Flattened from the same skill groups the page renders. */
      knowsAbout: skills.flatMap((group) => group.items),
      knowsLanguage: education.languages.map((language) => language.name),
      nationality: { "@type": "Country", name: "Nepal" },
    },
    {
      "@type": "WebSite",
      "@id": `${profile.siteUrl}/#website`,
      url: `${profile.siteUrl}/`,
      name: profile.name,
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${profile.siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${profile.siteUrl}/#webpage`,
      url: `${profile.siteUrl}/`,
      name: TITLE,
      description: DESCRIPTION,
      isPartOf: { "@id": `${profile.siteUrl}/#website` },
      about: { "@id": `${profile.siteUrl}/#person` },
      mainEntity: { "@id": `${profile.siteUrl}/#person` },
      inLanguage: "en",
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}

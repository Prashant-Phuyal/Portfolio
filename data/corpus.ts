import type { Passage } from "../lib/retrieval";
import {
  about,
  education,
  experience,
  profile,
  side,
  skills,
  work,
} from "./content";

/**
 * The searchable corpus for the "Ask this site" demo.
 *
 * Derived from the same exports the page renders, so the index can never drift
 * from what a visitor can actually read. Add content to content.ts and it
 * becomes searchable here automatically.
 */
export const corpus: Passage[] = [
  ...about.map((text, index) => ({
    id: `about-${index}`,
    source: "About",
    href: "#about",
    text,
  })),


  {
    id: "profile",
    source: "About",
    href: "#top",
    text: `${profile.name} is an ${profile.role} based in ${profile.location}. ${profile.title}. ${profile.pitch} ${profile.available}. Contact by email at ${profile.email}, or by phone or mobile on ${profile.phones.map((phone) => phone.display).join(" and ")}.`,
  },

  /* One passage per project paragraph, so a hit points at a specific idea. */
  ...work.flatMap((project) => [
    {
      id: `${project.slug}-summary`,
      source: project.name,
      href: "#work",
      text: `${project.name} — ${project.context}, ${project.sector}, built at ${project.period}. ${project.summary} ${project.pull}`,
    },
    ...project.story.map((text, index) => ({
      id: `${project.slug}-story-${index}`,
      source: project.name,
      href: "#work",
      text,
    })),
    {
      id: `${project.slug}-stack`,
      source: project.name,
      href: "#work",
      text: `${project.name} was built with ${project.stack.join(", ")}. ${project.credit}`,
    },
  ]),

  ...side.map((project) => ({
    id: `side-${project.name}`,
    source: project.name,
    href: "#work",
    text: `${project.name}, a ${project.kind} project. ${project.summary} Built with ${project.stack.join(", ")}.`,
  })),

  {
    id: "experience-summary",
    source: "Experience",
    href: "#experience",
    text: `${experience.role} at ${experience.company} in ${experience.location}, ${experience.period}, ${experience.note}. ${experience.summary}`,
  },

  ...experience.points.map((text, index) => ({
    id: `experience-${index}`,
    source: "Experience",
    href: "#experience",
    text,
  })),

  {
    id: "clients",
    source: "Experience",
    href: "#experience",
    text: `Clients served at ${experience.company}: ${experience.clients.join(", ")}.`,
  },

  ...skills.map((group) => ({
    id: `skills-${group.group}`,
    source: "Skills",
    href: "#skills",
    text: `${group.group}: ${group.items.join(", ")}.`,
  })),

  {
    /*
      Phrased the way people ask, not only the way the CV states it. Lexical
      retrieval has no synonyms, so a chunk that never says "studied" cannot
      answer "where did you study?" — enriching the chunk at ingestion time is
      how you fix that without an embedding model.
    */
    id: "education",
    source: "Education",
    href: "#about",
    text: `Studied and graduated with a ${education.degree} at ${education.school}, a university college in ${education.location}, ${education.period}, finishing with ${education.grade}. Also certified in ${education.certification}.`,
  },

  {
    id: "languages",
    source: "Education",
    href: "#about",
    text: `Spoken languages: ${education.languages
      .map((language) => `${language.name} (${language.level})`)
      .join(", ")}.`,
  },
];

/** Shown as clickable chips under the search box. */
export const suggestedQuestions = [
  "What have you built with RAG?",
  "Do you know Qdrant?",
  "Tell me about the IVF assistant",
  "What languages do you speak?",
  "Have you done computer vision?",
  "What is your favourite colour?",
];

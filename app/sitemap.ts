import type { MetadataRoute } from "next";
import { profile, work } from "../data/content";

/**
 * Emitted as /sitemap.xml at build time.
 *
 * Built from the same `work` array the pages are generated from, so a new
 * project appears in the sitemap automatically and the two can never drift.
 * The 404 route is deliberately absent.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${profile.siteUrl}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${profile.siteUrl}/projects/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...work.map((project) => ({
      url: `${profile.siteUrl}/projects/${project.slug}/`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}

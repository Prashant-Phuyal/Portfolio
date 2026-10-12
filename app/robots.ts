import type { MetadataRoute } from "next";
import { profile } from "../data/content";

/**
 * Emitted as /robots.txt at build time.
 *
 * Nothing is disallowed except the 404 route: the site is a public portfolio
 * and every asset — CSS, JS, fonts, images — needs to be crawlable for Google
 * to render and judge the page properly.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/404"],
      },
    ],
    sitemap: `${profile.siteUrl}/sitemap.xml`,
    host: profile.siteUrl,
  };
}

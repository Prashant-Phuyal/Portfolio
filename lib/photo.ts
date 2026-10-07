import fs from "node:fs";
import path from "node:path";

/**
 * Looks for a profile photo in public/ and returns its public path, or null.
 *
 * Checked on the server at build time rather than guessed in the browser: an
 * <img> pointed at a file that doesn't exist renders a broken-image icon before
 * any onError handler can swap it out. Knowing up front means the monogram is
 * rendered directly instead.
 *
 * To add a photo, drop any of these into public/ — nothing else to change.
 */
const CANDIDATES = [
  "prashant.jpg",
  "prashant.jpeg",
  "prashant.png",
  "prashant.webp",
  "profile.jpg",
  "profile.png",
];

export function findPhoto(): string | null {
  const publicDir = path.join(process.cwd(), "public");

  for (const name of CANDIDATES) {
    try {
      if (fs.existsSync(path.join(publicDir, name))) return `/${name}`;
    } catch {
      /* Unreadable public dir — fall through to the monogram. */
    }
  }

  return null;
}

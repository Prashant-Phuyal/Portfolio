/**
 * The site has no server-side behaviour — no API routes, no server actions, no
 * runtime data fetching — so it can be emitted as plain HTML/CSS/JS and hosted
 * anywhere static.
 *
 * `BUILD_TARGET=static` turns on that export, which is what the GitHub Pages
 * workflow uses. Without it the build stays a normal Next build, so `npm run
 * dev` and `npm run start` keep working locally and Vercel is unaffected.
 *
 * `BASE_PATH` is only needed when serving from a repository subpath, e.g.
 * https://<user>.github.io/<repo>/. With a custom domain it stays empty.
 */
const isStaticExport = process.env.BUILD_TARGET === "static";
const basePath = process.env.BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath,
  ...(isStaticExport
    ? {
        output: "export",
        /* No image optimiser exists on a static host. */
        images: { unoptimized: true },
        /* Emit /about/index.html rather than /about.html, which Pages prefers. */
        trailingSlash: true,
      }
    : {}),
};

module.exports = nextConfig;

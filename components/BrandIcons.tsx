/**
 * GitHub and LinkedIn marks as inline SVG.
 *
 * lucide-react removed its brand icons, so these live here rather than being
 * pinned to a particular version of that package. The API matches lucide's
 * (a `className` sized by the caller) so they drop into the same lists.
 */

type IconProps = { className?: string };

export function GithubIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 .5C5.73.5.9 5.36.9 11.68c0 4.95 3.19 9.14 7.62 10.62.56.1.76-.24.76-.54 0-.27-.01-1.16-.02-2.1-3.1.68-3.76-1.33-3.76-1.33-.5-1.3-1.24-1.64-1.24-1.64-1.01-.7.08-.68.08-.68 1.12.08 1.71 1.16 1.71 1.16 1 1.72 2.62 1.22 3.26.93.1-.73.39-1.22.7-1.5-2.47-.28-5.07-1.25-5.07-5.56 0-1.23.44-2.23 1.15-3.02-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.6 10.6 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.79 1.15 1.79 1.15 3.02 0 4.32-2.6 5.28-5.08 5.55.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54 4.42-1.49 7.6-5.67 7.6-10.62C23.1 5.36 18.27.5 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.635-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

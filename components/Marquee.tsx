"use client";

import { useEffect, useRef } from "react";
import { marquee } from "../data/content";

/**
 * A band of technologies that drifts on its own and surges with scroll speed —
 * the kinetic-typography trick that reads as alive rather than decorative.
 *
 * The base drift is a CSS animation, so the band still moves without
 * JavaScript. Scroll velocity only nudges the offset on top of that.
 */
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const track = trackRef.current;
    if (!track) return;

    let offset = 0;
    let velocity = 0;
    let lastScroll = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      const now = window.scrollY;
      velocity += (now - lastScroll) * 0.35;
      lastScroll = now;
    };

    const loop = () => {
      velocity *= 0.9; /* friction, so a surge settles back down */
      offset -= velocity;

      /* The row is duplicated, so wrapping at half its width is seamless. */
      const half = track.scrollWidth / 2;
      if (half > 0) offset = ((offset % half) + half) % half;

      track.style.transform = `translateX(${-offset}px)`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const row = [...marquee, ...marquee];

  return (
    <div className="mt-9 overflow-hidden border-y border-line py-4">
      <div className="mask-fade-x overflow-hidden">
        <div className="animate-marquee flex w-max">
          <div ref={trackRef} className="flex w-max items-center gap-10 pr-10">
            {row.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="flex shrink-0 items-center gap-10 font-mono text-[12px] uppercase tracking-[0.12em] text-faint"
              >
                {item}
                <span aria-hidden className="h-[3px] w-[3px] bg-line" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

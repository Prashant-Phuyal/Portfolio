"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/*
  Scroll reveals, built as progressive enhancement.

  The rule: nothing is hidden unless JavaScript is running. An inline script in
  layout.tsx puts a `js` class on <html> before first paint, and only then does
  CSS hide a `.reveal`. So if a script is blocked, slow or throws, the page is
  simply visible with no animation — never a blank section.

  Each reveal also carries a safety timeout, so a misfiring IntersectionObserver
  cannot strand content either.
*/

function useRevealed<T extends HTMLElement>(safetyMs = 1600) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* Already past it on load (deep link, restored scroll) — show at once. */
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    observer.observe(node);

    const timer = window.setTimeout(() => setShown(true), safetyMs);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [safetyMs]);

  return { ref, shown };
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, shown } = useRevealed<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
      className={`reveal ${shown ? "in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/** Reveals its direct children one after another. */
export function Stagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, shown } = useRevealed<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal-group ${shown ? "in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/** A direct child of <Stagger>. */
export function Item({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`reveal-child ${className}`}>{children}</div>;
}

/** A thin progress bar across the top of the window. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="no-print fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-fg"
    />
  );
}

/** Moves a child slower than the page as it scrolls past. */
export function Parallax({
  children,
  distance = 50,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Counts up the first time it scrolls into view.
 *
 * Two things worth knowing:
 *
 * 1. The safety fallback *snaps* to the final value rather than animating. An
 *    earlier version ran the animation on a 1.8s timer as its fallback, which
 *    meant the count played out off-screen while the visitor was still reading
 *    the hero — by the time they scrolled down it had already finished, and the
 *    counter looked like it had never run at all.
 *
 * 2. Small targets (1, 3, 8) barely read as a count, so the first part of the
 *    animation spins through digits like a dial before easing onto the real
 *    number. It reads as counting even when the number is a single digit.
 *
 * The true value is server-rendered, so with no JavaScript the figure is simply
 * correct and static.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1600,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  /* useLayoutEffect warns during SSR; useEffect is correct on the server. */
  const useIsomorphicLayoutEffect =
    typeof window === "undefined" ? useEffect : useLayoutEffect;

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Drop to zero before paint so there is no visible flicker from N to 0. */
  useIsomorphicLayoutEffect(() => {
    if (reduced()) return;
    setDisplay(0);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduced()) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let started = false;
    let lastSpin = 0;

    const run = () => {
      if (started) return;
      started = true;

      const begin = performance.now();
      const spinUntil = 0.5; /* fraction of the duration spent spinning */

      const tick = (now: number) => {
        const progress = Math.min((now - begin) / duration, 1);

        if (progress < spinUntil) {
          /* Dial spin — a new digit roughly every 70ms. */
          if (now - lastSpin > 70) {
            lastSpin = now;
            setDisplay(Math.floor(Math.random() * 10));
          }
        } else {
          /* Ease onto the real number, decelerating into it. */
          const settle = (progress - spinUntil) / (1 - spinUntil);
          setDisplay(Math.round(value * (1 - Math.pow(1 - settle, 3))));
        }

        if (progress < 1) frame = requestAnimationFrame(tick);
        else setDisplay(value);
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(node);

    /* If the observer never fires, show the right number — but do not burn the
       animation doing it, or a visitor who scrolls down later sees nothing. */
    const safety = window.setTimeout(() => {
      if (!started) setDisplay(value);
    }, 8000);

    return () => {
      observer.disconnect();
      window.clearTimeout(safety);
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}


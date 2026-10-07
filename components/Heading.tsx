"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A section heading whose words ride up into place when it scrolls into view.
 *
 * The words are real text in the DOM, and the clipping that hides them is
 * applied only under the `js` class that layout.tsx sets before first paint —
 * so without JavaScript the heading simply reads, unanimated. A safety timeout
 * covers an IntersectionObserver that never fires.
 */
export default function Heading({
  text,
  className = "",
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (node.getBoundingClientRect().top < window.innerHeight * 0.92) {
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    observer.observe(node);

    const timer = window.setTimeout(() => setShown(true), 1600);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={`words ${shown ? "in" : ""} ${className}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span style={{ animationDelay: `${index * 70}ms` }}>
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

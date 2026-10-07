"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Pulls its child a little toward the pointer, then springs back on leave.
 *
 * Wraps rather than replaces, so the child keeps whatever element and
 * behaviour it already had. Pointer devices only, and disabled under
 * prefers-reduced-motion.
 */
export default function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      node.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };

    const onLeave = () => {
      node.style.transform = "translate(0px, 0px)";
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <span
      ref={ref}
      className={`inline-block will-change-transform ${className ?? ""}`}
      style={{ transition: "transform 420ms cubic-bezier(0.22,1,0.36,1)" }}
    >
      {children}
    </span>
  );
}

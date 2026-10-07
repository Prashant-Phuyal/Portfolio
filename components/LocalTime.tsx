"use client";

import { useEffect, useState } from "react";

/**
 * Kathmandu time, ticking. A small sign that a person lives behind the page.
 *
 * Rendered empty on the server and filled after mount, because the server's
 * clock is not the visitor's and a mismatch would trip hydration.
 */
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kathmandu",
        }).format(new Date())
      );

    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  /* Reserve the width so the rail doesn't shift when the time arrives. */
  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ?? "--:--"} NPT
    </span>
  );
}

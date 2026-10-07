"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
} from "./BrandIcons";
import { nav, profile } from "../data/content";

/**
 * ⌘K / Ctrl-K palette: jump to a section, copy the email, open a profile,
 * download the CV, flip the theme. Entirely keyboard-driven.
 */

type Command = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
  keywords?: string;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  const go = useCallback(
    (hash: string) => {
      close();
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    },
    [close]
  );

  const commands = useMemo<Command[]>(() => {
    const sections: Command[] = nav.map((item) => ({
      id: `go-${item.href}`,
      label: `Go to ${item.label}`,
      icon: ArrowRight,
      keywords: "section jump navigate",
      run: () => go(item.href),
    }));

    return [
      ...sections,
      {
        id: "go-ask",
        label: "Try the retrieval demo",
        hint: "Ask this site",
        icon: Search,
        keywords: "search rag question demo",
        run: () => go("#ask"),
      },
      {
        id: "copy-email",
        label: "Copy email address",
        hint: profile.email,
        icon: copied ? Check : Copy,
        keywords: "contact mail reach",
        run: () => {
          navigator.clipboard?.writeText(profile.email).then(
            () => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1600);
            },
            () => {
              /* Clipboard blocked — the address is on screen anyway. */
            }
          );
          close();
        },
      },
      {
        id: "cv",
        label: "Download CV",
        hint: "PDF",
        icon: Download,
        keywords: "resume pdf",
        run: () => {
          const link = document.createElement("a");
          link.href = profile.cv;
          link.download = "";
          link.click();
          close();
        },
      },
      {
        id: "github",
        label: "Open GitHub",
        icon: GithubIcon,
        keywords: "code repositories source",
        run: () => {
          window.open(profile.github, "_blank", "noreferrer");
          close();
        },
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        icon: LinkedinIcon,
        keywords: "profile professional",
        run: () => {
          window.open(profile.linkedin, "_blank", "noreferrer");
          close();
        },
      },
      {
        id: "instagram",
        label: "Open Instagram",
        icon: InstagramIcon,
        keywords: "social photos",
        run: () => {
          window.open(profile.instagram, "_blank", "noreferrer");
          close();
        },
      },
      {
        id: "facebook",
        label: "Open Facebook",
        icon: FacebookIcon,
        keywords: "social",
        run: () => {
          window.open(profile.facebook, "_blank", "noreferrer");
          close();
        },
      },
      {
        id: "theme",
        label: "Toggle light / dark",
        icon:
          typeof document !== "undefined" &&
          document.documentElement.getAttribute("data-theme") === "dark"
            ? Sun
            : Moon,
        keywords: "theme appearance colour mode",
        run: () => {
          const root = document.documentElement;
          const next =
            root.getAttribute("data-theme") === "dark" ? "light" : "dark";
          root.setAttribute("data-theme", next);
          try {
            localStorage.setItem("theme", next);
          } catch {
            /* Private browsing — the choice just won't persist. */
          }
          close();
        },
      },
    ];
  }, [close, go, copied]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.hint ?? ""} ${command.keywords ?? ""}`
        .toLowerCase()
        .includes(needle)
    );
  }, [commands, query]);

  /* Open with ⌘K / Ctrl-K; close with Escape. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((value) => Math.min(value + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      filtered[cursor]?.run();
    }
  };

  /* Keep the highlighted row in view when arrowing through a long list. */
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${cursor}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="label no-print hidden items-center gap-2 border border-line px-3 py-2 transition-colors hover:!text-fg lg:inline-flex"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="border border-line px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div
      className="no-print fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
        style={{ animation: "fadeIn .2s ease both" }}
      />

      <div
        className="relative w-full max-w-lg overflow-hidden border border-line bg-bg"
        style={{ animation: "riseIn .28s cubic-bezier(.22,1,.36,1) both" }}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-4 w-4 shrink-0 text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to a section, copy my email, grab the CV…"
            className="w-full bg-transparent py-4 text-[15px] outline-none placeholder:text-faint"
          />
          <kbd className="shrink-0 border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-[14px] text-faint">
              Nothing matches “{query}”.
            </p>
          )}

          {filtered.map((command, position) => (
            <button
              key={command.id}
              data-index={position}
              type="button"
              onMouseEnter={() => setCursor(position)}
              onClick={command.run}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                position === cursor
                  ? "bg-fg text-bg"
                  : "text-fg hover:bg-line/40"
              }`}
            >
              <command.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-[14px]">{command.label}</span>
              {command.hint && (
                <span
                  className={`font-mono text-[11px] ${
                    position === cursor ? "text-bg/70" : "text-faint"
                  }`}
                >
                  {command.hint}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

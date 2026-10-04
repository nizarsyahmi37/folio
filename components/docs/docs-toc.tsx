"use client";

import { useEffect, useState } from "react";
import { touchTargetRow } from "@/lib/a11y";
import { cn } from "@/lib/utils";
import type { DocHeading } from "@/lib/docs";

export function DocsToc({ headings }: { headings: DocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-label="On this page" className="space-y-2">
      <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
        On this page
      </p>
      <ul className="space-y-1.5 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(heading.level === 3 && "pl-3")}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                touchTargetRow,
                "w-full text-muted-foreground underline decoration-transparent underline-offset-[3px] transition-colors hover:text-foreground hover:decoration-foreground",
                activeId === heading.id &&
                  "font-medium text-foreground decoration-foreground"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

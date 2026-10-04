import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { focusRing } from "@/lib/a11y";
import type { NavItem } from "@/lib/docs";

export function DocsPager({
  prev,
  next,
}: {
  prev: Extract<NavItem, { type: "page" }> | null;
  next: Extract<NavItem, { type: "page" }> | null;
}) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Page navigation"
      className="mt-12 grid gap-4 border-t pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={prev.href}
          className={`group flex min-h-11 flex-col justify-center gap-1 rounded-lg border p-4 text-foreground transition-colors hover:bg-muted ${focusRing}`}
        >
          <span className="flex min-h-11 items-center text-sm text-muted-foreground">
            <ChevronLeft className="mr-1 size-3.5" aria-hidden />
            Previous
          </span>
          <span className="font-medium">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className={`group flex min-h-11 flex-col items-end justify-center gap-1 rounded-lg border p-4 text-right text-foreground transition-colors hover:bg-muted sm:col-start-2 ${focusRing}`}
        >
          <span className="flex min-h-11 items-center text-sm text-muted-foreground">
            Next
            <ChevronRight className="ml-1 size-3.5" aria-hidden />
          </span>
          <span className="font-medium">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}

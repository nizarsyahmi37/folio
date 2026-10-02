import { focusRing, touchTarget } from "@/lib/a11y";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={`fixed left-4 top-4 z-[100] -translate-y-[200%] bg-background px-4 text-sm font-medium text-foreground shadow-md ${touchTarget} ${focusRing} focus:translate-y-0`}
    >
      Skip to main content
    </a>
  );
}

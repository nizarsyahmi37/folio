/**
 * WCAG 2.1 AAA helpers
 * - 2.4.7 / 1.4.11: visible focus with ≥3:1 indicator contrast
 * - 2.5.5: 44×44px minimum touch targets
 */

/** Visible focus indicator (3px ring + offset). */
export const focusRing =
  "rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-[3px] focus-visible:ring-offset-background";

/** Minimum pointer target size (44×44 CSS px). */
export const touchTarget = "inline-flex min-h-11 min-w-11 items-center justify-center";

/** Nav / list link row height for AAA target size. */
export const touchTargetRow =
  "flex min-h-11 items-center rounded-md px-3 text-sm";

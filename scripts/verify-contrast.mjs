import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { interpolate, parse, wcagContrast } from "culori";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "app/globals.css"), "utf8");

function extractBlock(selector) {
  const re = new RegExp(`${selector}\\s*\\{([^}]+)\\}`, "s");
  const match = css.match(re);
  if (!match) return {};
  const tokens = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^\s*--([a-z-]+):\s*([^;]+);/);
    if (m) tokens[m[1]] = m[2].trim();
  }
  return tokens;
}

const light = extractBlock(":root");
const dark = extractBlock("\\.dark");

function ratio(fg, bg) {
  return wcagContrast(parse(fg), parse(bg));
}

/** Opaque color from `top` at `alpha` over `bottom` (sRGB). */
function composite(bottom, top, alpha) {
  return interpolate([parse(bottom), parse(top)])(alpha);
}

/** Text pairs that must meet 7:1 (WCAG 2.1 AAA 1.4.6). */
function textPairs(theme, t) {
  const bg = t.background;
  return [
    ["foreground on background", t.foreground, bg],
    ["muted-foreground on background", t["muted-foreground"], bg],
    ["foreground on card", t["card-foreground"], t.card],
    ["foreground on popover", t["popover-foreground"], t.popover],
    ["foreground on muted (code blocks)", t.foreground, t.muted],
    ["muted-foreground on muted (secondary bands)", t["muted-foreground"], t.muted],
    ["secondary-foreground on secondary", t["secondary-foreground"], t.secondary],
    ["accent-foreground on accent", t["accent-foreground"], t.accent],
    ["primary-foreground on primary", t["primary-foreground"], t.primary],
    ["sidebar-foreground on sidebar", t["sidebar-foreground"], t.sidebar],
    [
      "sidebar-accent-foreground on sidebar-accent",
      t["sidebar-accent-foreground"],
      t["sidebar-accent"],
    ],
    [
      "muted-foreground on sidebar (section labels)",
      t["muted-foreground"],
      t.sidebar,
    ],
    ["destructive on background", t.destructive, bg],
  ];
}

/** Non-text UI pairs that must meet 3:1 (1.4.11). */
function uiPairs(theme, t) {
  const bg = t.background;
  return [
    ["border on background", t.border, bg],
    ["input on background", t.input, bg],
    ["sidebar-border on sidebar", t["sidebar-border"], t.sidebar],
    ["ring on background (focus)", t.ring, bg],
  ];
}

let failed = false;

for (const [name, tokens] of [
  ["light", light],
  ["dark", dark],
]) {
  console.log(`\n${name.toUpperCase()} — text (7:1)`);
  for (const [label, fg, bg] of textPairs(name, tokens)) {
    if (!fg || !bg) {
      console.log(`? [${name}] ${label}: missing token`);
      failed = true;
      continue;
    }
    const r = ratio(fg, bg);
    const ok = r >= 7;
    if (!ok) failed = true;
    console.log(`${ok ? "✓" : "✗"} [${name}] ${label}: ${r.toFixed(2)}:1`);
  }

  console.log(`\n${name.toUpperCase()} — UI (3:1)`);
  for (const [label, fg, bg] of uiPairs(name, tokens)) {
    if (!fg || !bg) {
      console.log(`? [${name}] ${label}: missing token`);
      failed = true;
      continue;
    }
    const r = ratio(fg, bg);
    const ok = r >= 3;
    if (!ok) failed = true;
    console.log(`${ok ? "✓" : "✗"} [${name}] ${label}: ${r.toFixed(2)}:1`);
  }
}

console.log("\nCOMPOSITE — text on layered surfaces (7:1)");
for (const [name, tokens] of [
  ["light", light],
  ["dark", dark],
]) {
  const page = tokens.background;
  const blends = [
    [
      "foreground on muted/40 over background (callout)",
      tokens.foreground,
      composite(page, tokens.muted, 0.4),
    ],
    [
      "foreground on muted/50 over background (hover)",
      tokens.foreground,
      composite(page, tokens.muted, 0.5),
    ],
    [
      "destructive on background (destructive buttons)",
      tokens.destructive,
      page,
    ],
    [
      "popover-foreground on popover (menus)",
      tokens["popover-foreground"],
      tokens.popover,
    ],
    [
      "foreground on outline button surface (background)",
      tokens.foreground,
      page,
    ],
    [
      "primary-foreground on primary/80 (button hover)",
      tokens["primary-foreground"],
      composite(tokens.primary, tokens["primary-foreground"], 0.2),
    ],
  ];

  for (const [label, fg, bg] of blends) {
    const fgColor = typeof fg === "string" ? parse(fg) : fg;
    const bgColor = typeof bg === "string" ? parse(bg) : bg;
    const r = wcagContrast(fgColor, bgColor);
    const ok = r >= 7;
    if (!ok) failed = true;
    console.log(`${ok ? "✓" : "✗"} [${name}] ${label}: ${r.toFixed(2)}:1`);
  }
}

if (failed) {
  console.error("\nContrast verification failed for one or more theme pairs.");
  process.exit(1);
}

console.log(
  "\n✓ WCAG 2.1 Level AAA contrast: light (`:root`) and dark (`.dark`) themes passed all checked pairs."
);

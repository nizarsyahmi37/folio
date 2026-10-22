import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(script) {
  const r = spawnSync(process.execPath, [join(root, "scripts", script)], {
    stdio: "inherit",
    cwd: root,
  });
  return r.status === 0;
}

const steps = [
  ["verify-ui-source.mjs", "WCAG 2.1 AAA — UI source (light/dark typography)"],
  ["verify-contrast.mjs", "WCAG 2.1 AAA — contrast (`:root` + `.dark`)"],
  ["verify-pages.mjs", "WCAG/UAAG — every route shell (/, /docs, /dashboard, 404)"],
  ["verify-aria.mjs", "WAI-ARIA 1.2 — roles, names, states (APG patterns)"],
  ["verify-uaag.mjs", "UAAG 2.0 — assistive technology alignment"],
  ["verify-content.mjs", "ATAG 2.0 Part B — MDX author checks"],
];

console.log("═══════════════════════════════════════════════════════");
console.log(" Folio accessibility gate");
console.log(" WCAG 2.1 AAA · WAI-ARIA · ATAG 2.0 AAA · UAAG 2.0 alignment");
console.log(" Light and dark reader UI + MDX authoring");
console.log("═══════════════════════════════════════════════════════\n");

for (let i = 0; i < steps.length; i++) {
  const [script, label] = steps[i];
  console.log(`Step ${i + 1}/${steps.length} — ${label}\n`);
  if (!run(script)) {
    process.exit(1);
  }
  console.log("");
}

console.log("═══════════════════════════════════════════════════════");
console.log(" Passed WCAG, WAI-ARIA, ATAG, and UAAG alignment checks");
console.log(" Complete docs/atag-manual-checklist.md before each release");
console.log(
  " See WCAG-, WAI-ARIA-, ATAG-, and UAAG-CONFORMANCE.md in the repo root"
);
console.log("═══════════════════════════════════════════════════════\n");

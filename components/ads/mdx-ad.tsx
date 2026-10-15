"use client";

import type { AdPlacement } from "@/lib/ads-config";
import { getAdsenseSlot } from "@/lib/ads-config";
import { AdsenseUnit } from "@/components/ads/adsense-unit";

type MdxAdProps = {
  /** Use a named placement from env, or pass `slot` directly. */
  placement?: AdPlacement;
  slot?: string;
};

/** In-article ad for MDX: `<Ad />` or `<Ad slot="1234567890" />`. */
export function MdxAd({ placement = "docsArticle", slot: slotProp }: MdxAdProps) {
  const slot = slotProp ?? getAdsenseSlot(placement);
  if (!slot) return null;

  return (
    <aside
      aria-label="Advertisement"
      className="my-10 not-prose rounded-md border border-border bg-muted/40 p-4"
    >
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Sponsored
      </p>
      <AdsenseUnit slot={slot} />
    </aside>
  );
}

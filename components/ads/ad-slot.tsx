import type { AdPlacement } from "@/lib/ads-config";
import { getAdsenseSlot } from "@/lib/ads-config";
import { AdsenseUnit } from "@/components/ads/adsense-unit";

type AdSlotProps = {
  placement: AdPlacement;
  /** Override slot id (AdSense ad unit). */
  slot?: string;
  className?: string;
};

/**
 * Accessible ad wrapper. Renders nothing until AdSense env vars are configured.
 */
export function AdSlot({ placement, slot: slotOverride, className }: AdSlotProps) {
  const slot = slotOverride ?? getAdsenseSlot(placement);
  if (!slot) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={className}
      data-folio-ad={placement}
    >
      <p className="sr-only">Advertisement</p>
      <AdsenseUnit slot={slot} className="min-h-[90px] w-full" />
    </aside>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getAdsenseClientId, isAdsenseEnabled } from "@/lib/ads-config";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export type AdsenseUnitProps = {
  slot: string;
  className?: string;
  /** AdSense `data-ad-format` (default `auto`). */
  format?: string;
  fullWidthResponsive?: boolean;
};

export function AdsenseUnit({
  slot,
  className,
  format = "auto",
  fullWidthResponsive = true,
}: AdsenseUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!isAdsenseEnabled() || !slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* Ad blockers or script not loaded yet */
    }
  }, [slot]);

  if (!isAdsenseEnabled() || !slot) return null;

  return (
    <ins
      className={cn("adsbygoogle block", className)}
      style={{ display: "block" }}
      data-ad-client={getAdsenseClientId()}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}

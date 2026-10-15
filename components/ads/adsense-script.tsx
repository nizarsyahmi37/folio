import Script from "next/script";
import { getAdsenseClientId, isAdsenseEnabled } from "@/lib/ads-config";

/** Loads the AdSense library once per site when `NEXT_PUBLIC_ADSENSE_CLIENT_ID` is set. */
export function AdsenseScript() {
  if (!isAdsenseEnabled()) return null;

  const client = getAdsenseClientId();

  return (
    <Script
      id="adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

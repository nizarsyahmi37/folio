export type AdPlacement = "docsSidebar" | "docsArticle" | "home";

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() ?? "";

const slots: Record<AdPlacement, string> = {
  docsSidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DOCS_SIDEBAR?.trim() ?? "",
  docsArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DOCS_ARTICLE?.trim() ?? "",
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME?.trim() ?? "",
};

/** True when a publisher client id is set (ads are opt-in via env). */
export function isAdsenseEnabled(): boolean {
  return clientId.length > 0 && clientId.startsWith("ca-pub-");
}

export function getAdsenseClientId(): string {
  return clientId;
}

export function getAdsenseSlot(placement: AdPlacement): string | null {
  if (!isAdsenseEnabled()) return null;
  const slot = slots[placement];
  return slot.length > 0 ? slot : null;
}

export function hasAdsensePlacement(placement: AdPlacement): boolean {
  return getAdsenseSlot(placement) !== null;
}

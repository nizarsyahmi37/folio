import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { FolioLogo } from "@/components/folio-logo";
import { Button } from "@/components/ui/button";
import { hasAdsensePlacement } from "@/lib/ads-config";
import { siteConfig } from "@/lib/site-config";

const pillars = [
  {
    title: "Beautiful writing",
    body: "Typography and spacing that let your words breathe—so ideas land with clarity.",
  },
  {
    title: "Organized knowledge",
    body: "Structure that scales from a single guide to a full library, without losing the thread.",
  },
  {
    title: "A calm read",
    body: "Focused layouts, thoughtful navigation, and nothing competing with the page.",
  },
];

export default function HomePage() {
  const homeAd = hasAdsensePlacement("home");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <FolioLogo />
          <nav className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/docs" />}
            >
              Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Workspace
            </Button>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-24 md:pt-32">
          <p className="text-sm font-medium tracking-wide text-foreground uppercase">
            Documentation, refined
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-medium leading-[1.15] tracking-tight text-balance text-foreground md:text-5xl lg:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" nativeButton={false} render={<Link href="/docs" />}>
              Open Folio
            </Button>
          </div>
        </section>

        {homeAd ? (
          <section className="border-t border-border px-6 py-10">
            <div className="mx-auto max-w-3xl">
              <AdSlot placement="home" />
            </div>
          </section>
        ) : null}

        <section className="border-t border-border bg-muted">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-3">
            {pillars.map((item) => (
              <div key={item.title} className="space-y-2">
                <h2 className="font-serif text-lg font-medium tracking-tight text-foreground">
                  {item.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <p className="text-center text-sm text-muted-foreground">
          {siteConfig.name} — write once, read beautifully.
        </p>
      </footer>
    </div>
  );
}

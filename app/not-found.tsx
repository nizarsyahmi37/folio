import Link from "next/link";
import { FolioLogo } from "@/components/folio-logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
          <FolioLogo />
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto flex max-w-lg flex-1 flex-col justify-center px-6 py-16"
      >
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          This page does not exist or may have moved. Try the knowledge base or
          return home.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button nativeButton={false} render={<Link href="/docs" />}>
            Knowledge base
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
            Home
          </Button>
        </div>
      </main>
    </div>
  );
}

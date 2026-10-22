import Link from "next/link";
import { FolioLogo } from "@/components/folio-logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Workspace",
  description: "Manage your Folio workspace",
};

export default function DashboardPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16"
    >
      <FolioLogo className="text-xl" />
      <h1 className="mt-8 font-serif text-3xl font-medium tracking-tight text-foreground">
        Workspace
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Placeholder for auth, teams, and publishing. Your docs live in{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
          content/docs/
        </code>{" "}
        until you connect a backend.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button nativeButton={false} render={<Link href="/docs" />}>
          Open docs
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
          Home
        </Button>
      </div>
    </main>
  );
}

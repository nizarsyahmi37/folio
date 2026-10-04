"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { ThemeToggle } from "@/components/docs/theme-toggle";
import { FolioLogo } from "@/components/folio-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { NavItem } from "@/lib/docs";

export function DocsShell({
  tree,
  children,
}: {
  tree: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background backdrop-blur-md supports-backdrop-filter:bg-background">
        <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="size-4" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b px-4 py-3 text-left">
                <SheetTitle className="font-serif font-medium">
                  <Link href="/docs">Knowledge</Link>
                </SheetTitle>
              </SheetHeader>
              <DocsSidebar tree={tree} />
            </SheetContent>
          </Sheet>

          <FolioLogo />
          <span className="hidden text-muted-foreground sm:inline" aria-hidden>
            /
          </span>
          <Link
            href="/docs"
            className="hidden text-sm text-foreground transition-colors hover:underline sm:inline"
          >
            Knowledge
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              Workspace
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          aria-label="Knowledge base navigation"
          className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block"
        >
          <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
            <DocsSidebar tree={tree} />
          </div>
        </aside>

        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

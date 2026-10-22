"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { focusRing, touchTarget, touchTargetRow } from "@/lib/a11y";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/docs";

function NavLink({
  href,
  title,
  active,
}: {
  href: string;
  title: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        touchTargetRow,
        "w-full text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active &&
          "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
      )}
    >
      {title}
    </Link>
  );
}

function SidebarNode({ item, pathname }: { item: NavItem; pathname: string }) {
  if (item.hidden) {
    return null;
  }

  if (item.type === "page") {
    return (
      <NavLink
        href={item.href}
        title={item.title}
        active={pathname === item.href}
      />
    );
  }

  const isActive =
    item.href === pathname ||
    item.children.some(
      (child) =>
        (child.type === "page" && child.href === pathname) ||
        (child.type === "folder" && child.href === pathname)
    );

  return (
    <SidebarFolder
      key={`${item.name}:${isActive}`}
      item={item}
      pathname={pathname}
      isActive={isActive}
    />
  );
}

function SidebarFolder({
  item,
  pathname,
  isActive,
}: {
  item: Extract<NavItem, { type: "folder" }>;
  pathname: string;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(isActive);
  const panelId = `sidebar-section-${item.name}`;

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <div className="flex items-center gap-0.5">
        {item.href ? (
          <Link
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              touchTargetRow,
              "min-w-0 flex-1 font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              pathname === item.href &&
                "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            {item.title}
          </Link>
        ) : (
          <span className={cn(touchTargetRow, "min-w-0 flex-1 font-medium text-muted-foreground")}>
            {item.title}
          </span>
        )}
        <CollapsibleTrigger
          className={cn(
            touchTarget,
            "shrink-0 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            focusRing
          )}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? "Collapse" : "Expand"} ${item.title} section`}
        >
          <ChevronRight
            aria-hidden
            className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent
        id={panelId}
        className="ml-2 border-l border-sidebar-border pl-2"
      >
        <div className="flex flex-col gap-0.5 py-1">
          {item.children.map((child) => (
            <SidebarNode key={child.name} item={child} pathname={pathname} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function DocsSidebar({ tree }: { tree: NavItem[] }) {
  const pathname = usePathname();

  return (
    <ScrollArea className="h-full flex-1">
      <nav aria-label="Knowledge base" className="flex flex-col gap-1 p-4">
        {tree.map((item) => (
          <SidebarNode key={item.name} item={item} pathname={pathname} />
        ))}
      </nav>
    </ScrollArea>
  );
}

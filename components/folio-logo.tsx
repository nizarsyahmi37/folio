import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type FolioLogoProps = {
  className?: string;
  href?: string;
};

export function FolioLogo({ className, href = "/" }: FolioLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "font-serif text-lg font-medium tracking-tight text-foreground rounded-sm",
        className
      )}
    >
      {siteConfig.name}
    </Link>
  );
}

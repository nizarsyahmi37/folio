import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DocsBreadcrumb({
  title,
  slug,
}: {
  title: string;
  slug: string[];
}) {
  const segments = slug.map((part, index) => ({
    label: part.replace(/-/g, " "),
    href: `/docs/${slug.slice(0, index + 1).join("/")}`,
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/docs" />}>Knowledge</BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment) => (
          <span key={segment.href} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {segment.href === `/docs/${slug.join("/")}` ? (
                <BreadcrumbPage className="capitalize">
                  {title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  render={<Link href={segment.href} />}
                  className="capitalize"
                >
                  {segment.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
        {slug.length === 0 ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

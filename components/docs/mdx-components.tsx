import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { FolioImage, FolioVideo } from "@/components/docs/mdx-authoring";
import { cn } from "@/lib/utils";

type CalloutProps = {
  title?: string;
  type?: "info" | "warning" | "tip";
  children: ReactNode;
};

export function Callout({ title, type = "info", children }: CalloutProps) {
  const accent = {
    info: "border-l-border",
    warning: "border-l-border",
    tip: "border-l-border",
  };

  return (
    <div
      className={cn(
        "my-8 rounded-md border border-border border-l-4 bg-muted px-5 py-4 text-sm not-prose",
        accent[type]
      )}
    >
      {title ? (
        <p className="mb-1.5 font-medium text-foreground">{title}</p>
      ) : null}
      <div className="leading-relaxed text-foreground [&_p]:my-1">
        {children}
      </div>
    </div>
  );
}

function Pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className="overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm text-foreground"
      {...props}
    >
      {children}
    </pre>
  );
}

function Code({ children, className, ...props }: ComponentPropsWithoutRef<"code">) {
  const isBlock = className?.includes("language-");
  if (isBlock) {
    return (
      <code
        className={cn("font-mono text-[0.875em] text-foreground", className)}
        {...props}
      >
        {children}
      </code>
    );
  }
  return (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
      {...props}
    >
      {children}
    </code>
  );
}

function createHeading(level: 2 | 3 | 4) {
  const Tag = `h${level}` as const;
  const sizes = {
    2: "font-serif text-2xl font-medium tracking-tight text-foreground mt-12 mb-4 scroll-mt-24",
    3: "font-serif text-xl font-medium tracking-tight text-foreground mt-10 mb-3 scroll-mt-24",
    4: "font-serif text-lg font-medium text-foreground mt-8 mb-2 scroll-mt-24",
  };

  return function Heading({
    children,
    id,
    ...props
  }: ComponentPropsWithoutRef<"h2">) {
    return (
      <Tag id={id} className={sizes[level]} {...props}>
        {children}
      </Tag>
    );
  };
}

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1
      id="doc-title"
      className="font-serif text-[2rem] font-medium leading-tight tracking-tight text-balance text-foreground md:text-4xl mb-8"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  p: ({ children, ...props }) => (
    <p className="leading-[1.75] text-foreground [&:not(:first-child)]:mt-5" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          className="text-foreground underline decoration-foreground underline-offset-[3px] hover:decoration-2"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="text-foreground underline decoration-foreground underline-offset-[3px] hover:decoration-2"
        {...props}
      >
        {children}
      </Link>
    );
  },
  ul: ({ children, ...props }) => (
    <ul className="my-4 ml-6 list-disc text-foreground [&>li]:mt-2 [&>li]:text-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-4 ml-6 list-decimal text-foreground [&>li]:mt-2 [&>li]:text-foreground" {...props}>
      {children}
    </ol>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-4 border-l-2 border-border pl-4 text-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, scope, ...props }) => (
    <th
      scope={scope ?? "col"}
      className="border border-border bg-muted px-3 py-2 text-left font-semibold text-foreground"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-border px-3 py-2 text-foreground" {...props}>
      {children}
    </td>
  ),
  pre: Pre,
  code: Code,
  Callout,
  FolioImage,
  FolioVideo,
};

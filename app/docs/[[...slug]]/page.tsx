import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { DocPageSkeleton } from "@/components/docs/doc-page-skeleton";
import { DocsBreadcrumb } from "@/components/docs/docs-breadcrumb";
import { DocsPager } from "@/components/docs/docs-pager";
import { DocsToc } from "@/components/docs/docs-toc";
import { AdSlot } from "@/components/ads/ad-slot";
import { mdxComponents } from "@/components/docs/mdx-components";
import { hasAdsensePlacement } from "@/lib/ads-config";
import {
  extractHeadings,
  getAdjacentDocs,
  getAllDocSlugs,
  getDocBySlug,
} from "@/lib/docs";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
  return getAllDocSlugs();
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug ?? []);

  if (!doc) {
    return { title: "Not found" };
  }

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  };
}

export default function DocPage({ params }: PageProps) {
  return (
    <Suspense fallback={<DocPageSkeleton />}>
      <DocPageContent params={params} />
    </Suspense>
  );
}

async function DocPageContent({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug ?? []);

  if (!doc) {
    notFound();
  }

  const headings = extractHeadings(doc.content);
  const { prev, next } = getAdjacentDocs(doc.slug);
  const showDocAds = doc.frontmatter.ads !== false;
  const sidebarAd = showDocAds && hasAdsensePlacement("docsSidebar");
  const articleAd = showDocAds && hasAdsensePlacement("docsArticle");

  const { content } = await compileMDX({
    source: doc.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
        ],
      },
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-12 px-4 py-10 lg:px-10">
      <article
        aria-labelledby="doc-title"
        lang={doc.frontmatter.lang ?? undefined}
        className="min-w-0 flex-1 max-w-[70ch]"
      >
        <DocsBreadcrumb title={doc.frontmatter.title ?? "Docs"} slug={doc.slug} />
        <div className="folio-prose mt-8">{content}</div>
        {articleAd ? (
          <AdSlot placement="docsArticle" className="mt-10 max-w-[70ch]" />
        ) : null}
        <DocsPager prev={prev} next={next} />
      </article>
      <aside
        className={
          sidebarAd
            ? "hidden w-56 shrink-0 xl:block xl:w-64"
            : "hidden w-56 shrink-0 xl:block"
        }
      >
        <div className="sticky top-24 space-y-8">
          <DocsToc headings={headings} />
          {sidebarAd ? <AdSlot placement="docsSidebar" /> : null}
        </div>
      </aside>
    </div>
  );
}

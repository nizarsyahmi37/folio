import { DocsShell } from "@/components/docs/docs-shell";
import { getDocsNavTree } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const tree = getDocsNavTree();

  return <DocsShell tree={tree}>{children}</DocsShell>;
}

export function DocPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl gap-10 px-4 py-8 lg:px-8">
      <article className="min-w-0 flex-1 max-w-3xl animate-pulse space-y-4">
        <div className="h-4 w-48 rounded bg-muted" />
        <div className="h-8 w-3/4 rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
        </div>
      </article>
    </div>
  );
}

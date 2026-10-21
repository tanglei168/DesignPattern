export function GallerySkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-14 border-b" />
      <div className="mx-auto grid max-w-[1440px] gap-4 px-4 py-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border">
            <div className="aspect-video animate-pulse bg-muted" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

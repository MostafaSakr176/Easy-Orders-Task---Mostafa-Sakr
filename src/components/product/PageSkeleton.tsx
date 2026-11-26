export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8" aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading product</p>
      <div className="h-8 w-40 animate-pulse rounded bg-[#f2f2f2]" />
      <div className="mt-8 flex flex-col gap-8 xl:flex-row">
        <div className="h-[610px] w-full max-w-[458px] animate-pulse rounded-lg bg-[#f2f2f2]" />
        <div className="flex-1 space-y-4">
          <div className="h-4 w-40 animate-pulse rounded bg-[#f2f2f2]" />
          <div className="h-10 w-full animate-pulse rounded bg-[#f2f2f2]" />
          <div className="h-8 w-48 animate-pulse rounded bg-[#f2f2f2]" />
          <div className="h-24 w-full animate-pulse rounded bg-[#f2f2f2]" />
        </div>
      </div>
    </div>
  );
}

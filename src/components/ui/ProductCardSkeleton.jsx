function SkeletonBlock({ className }) {
  return <div className={`mm-shimmer rounded-2xl ${className}`} />;
}

export default function ProductCardSkeleton() {
  return (
    <article className="flex h-[380px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="overflow-hidden rounded-xl bg-slate-100">
        <SkeletonBlock className="h-[140px] w-full min-[380px]:h-[160px] sm:h-[180px]" />
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="space-y-3">
          <SkeletonBlock className="h-5 w-20 rounded-full" />
          <SkeletonBlock className="h-5 w-4/5" />
          <SkeletonBlock className="h-4 w-2/5" />
          <SkeletonBlock className="h-4 w-3/5" />
          <SkeletonBlock className="h-7 w-28" />
        </div>

        <div className="mt-auto flex gap-3 pt-4">
          <SkeletonBlock className="h-11 flex-1 rounded-xl" />
          <SkeletonBlock className="h-11 flex-1 rounded-xl" />
        </div>
      </div>
    </article>
  );
}

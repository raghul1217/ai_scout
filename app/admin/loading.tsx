export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24314F]/40">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[#0D1730] border border-[#24314F] rounded-xl" />
          <div className="h-4 w-72 bg-[#0D1730]/60 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-[#0D1730] border border-[#24314F] rounded-xl" />
          <div className="h-10 w-28 bg-[#0D1730] border border-[#24314F] rounded-xl" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-[#0D1730] border border-[#24314F] space-y-3"
          >
            <div className="h-3 w-20 bg-[#24314F]/50 rounded" />
            <div className="h-7 w-16 bg-[#24314F] rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main Table / Content Skeleton */}
      <div className="p-6 rounded-2xl bg-[#0D1730] border border-[#24314F] space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-[#24314F]/50">
          <div className="h-5 w-32 bg-[#24314F]/60 rounded" />
          <div className="h-8 w-48 bg-[#24314F]/40 rounded-xl" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 w-full bg-[#050816]/60 border border-[#24314F]/40 rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
}


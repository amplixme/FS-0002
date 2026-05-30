function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[16/9] bg-surface-container rounded-xl mb-5" />
      <div className="h-3 bg-surface-container rounded w-24 mb-3" />
      <div className="h-6 bg-surface-container rounded w-3/4 mb-2" />
      <div className="h-4 bg-surface-container rounded w-full mb-1" />
      <div className="h-4 bg-surface-container rounded w-5/6 mb-4" />
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-surface-container rounded-full" />
        <div className="h-3 bg-surface-container rounded w-28" />
      </div>
    </div>
  );
}

export function SkeletonLoader() {
  return (    
    <div className="space-y-12 mt-4">
      {[1,2].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}


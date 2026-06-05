export default function CardSkeleton({ rows = 2 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="border border-outline-variant/20 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-surface-container rounded w-3/4" />
              <div className="h-3 bg-surface-container rounded w-1/2" />
            </div>
          </div>
          <div className="h-3 bg-surface-container rounded w-full" />
        </div>
      ))}
    </div>
  );
}
export default function ProfileSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl ambient-shadow p-8 mb-8 animate-pulse">
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-surface-container shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-surface-container rounded w-40" />
          <div className="h-4 bg-surface-container rounded w-64" />
          <div className="h-3 bg-surface-container rounded w-52" />
        </div>
      </div>
    </div>
  );
}

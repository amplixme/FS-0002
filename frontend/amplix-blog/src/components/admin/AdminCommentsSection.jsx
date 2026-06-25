export default function AdminCommentsSection({ comments, loading, onDelete, formatDate }) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl ambient-shadow p-6">
      <h2 className="text-lg font-bold text-on-surface mb-5">Comentarios Recientes</h2>

      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 bg-surface-container rounded w-full" />
              <div className="h-4 bg-surface-container rounded w-4/5" />
              <div className="h-3 bg-surface-container rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-8">No hay comentarios</p>
      ) : (
        <div className="divide-y divide-outline-variant/40">
          {comments.map((c) => (
            <div key={c.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                    account_circle
                  </span>
                  <span className="text-sm font-semibold text-on-surface">{c.author?.name}</span>
                </div>
                <span className="text-xs text-on-surface-variant/60">
                  {formatDate(c.createdAt)}
                </span>
              </div>

              <p className="text-sm text-on-surface italic line-clamp-3 leading-relaxed mb-2">
                "{c.content}"
              </p>

              <p className="text-xs text-on-surface-variant/60 truncate mb-3">
                En: {c.post?.title}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => onDelete(c)}
                  className="text-xs cursor-pointer font-semibold text-error hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function PostCard({ p, onDelete, formatDate }) {
  return (
    <div className="border border-outline-variant/40 rounded-xl overflow-hidden">
      <div className="flex gap-3 p-4">
        {p.coverImage ? (
          <img
            src={p.coverImage}
            alt=""
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">
              image
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          {p.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {p.categories.slice(0, 2).map((c) => (
                <span
                  key={c.id}
                  className="text-xs font-bold text-secondary uppercase tracking-wide"
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}
          <p className="font-semibold text-on-surface text-sm line-clamp-2 leading-snug">
            {p.title}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="px-4 pb-3 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-on-surface-variant/60 uppercase font-semibold tracking-wide">
            Autor
          </p>
          <p className="text-sm text-on-surface">{p.author?.name}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant/60 uppercase font-semibold tracking-wide">
            Fecha
          </p>
          <p className="text-sm text-on-surface">{formatDate(p.createdAt)}</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center border-t border-outline-variant/30">
        <button
          onClick={onDelete}
          className="flex-1 text-xs font-semibold text-error py-3 hover:underline text-center"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

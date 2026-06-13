export default function CategoryRow({ cat, onEdit, onDelete }) {
  const postCount = cat._count?.posts ?? 0;

  return (
    <div className="flex flex-col gap-2">
      {/* ── Fila 1: ícono + nombre + slug ── */}
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-[20px] text-outline flex-shrink-0 mt-0.5">
          label
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-on-surface">{cat.name}</p>
          <p className="text-xs font-mono text-outline mt-0.5">{cat.slug}</p>
        </div>
      </div>

      {/* ── Fila 2: contador + botones ── */}
      <div className="flex items-center gap-2 pl-8">
        <span className="text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-full">
          {postCount} {postCount === 1 ? "post" : "posts"}
        </span>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => onEdit(cat)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold rounded-full transition-colors text-xs"
          >
            <span className="material-symbols-outlined text-[15px]">edit</span>
            Editar
          </button>
          <button
            onClick={() => onDelete(cat)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-error/10 hover:bg-error/20 text-error font-bold rounded-full transition-colors text-xs"
          >
            <span className="material-symbols-outlined text-[15px]">delete</span>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

import CategoryRow from "./CategoryRow";
import CategoryEditRow from "./CategoryEditRow";

export default function CategoryList({
  categories,
  loadingList,
  listError,
  editingId,
  editName,
  setEditName,
  editSlug,
  setEditSlug,
  updating,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl ambient-shadow overflow-hidden">
      <div className="p-8 sm:p-10">

        {/* ── Encabezado ── */}
        <div className="flex items-center gap-3 mb-6 border-b border-outline-variant/30 pb-6">
          <span className="material-symbols-outlined text-primary text-[22px]">label</span>
          <h2 className="text-xl font-extrabold text-on-surface flex-1">
            Categorías existentes
          </h2>
          {!loadingList && (
            <span className="text-sm font-semibold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
              {categories.length}
            </span>
          )}
        </div>

        {/* ── Cargando ── */}
        {loadingList && (
          <div className="flex items-center justify-center gap-3 text-primary py-12">
            <span className="material-symbols-outlined animate-spin text-[28px]">
              progress_activity
            </span>
            <span className="font-medium">Cargando categorías...</span>
          </div>
        )}

        {/* ── Error ── */}
        {listError && (
          <div className="p-4 bg-error/10 text-error rounded-xl text-sm font-medium border border-error/20">
            {listError}
          </div>
        )}

        {/* ── Vacío ── */}
        {!loadingList && !listError && categories.length === 0 && (
          <div className="text-center py-14 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl text-outline mb-4 block">
              label_off
            </span>
            <p className="font-bold text-on-surface">No hay categorías todavía.</p>
            <p className="text-sm mt-1">Creá la primera usando el formulario de arriba.</p>
          </div>
        )}

        {/* ── Lista ── */}
        {!loadingList && categories.length > 0 && (
          <ul className="divide-y divide-outline-variant/30">
            {categories.map((cat) => (
              <li key={cat.id} className="py-4 first:pt-0 last:pb-0">
                {editingId === cat.id ? (
                  <CategoryEditRow
                    id={cat.id}
                    editName={editName}
                    setEditName={setEditName}
                    editSlug={editSlug}
                    setEditSlug={setEditSlug}
                    updating={updating}
                    onSave={onSave}
                    onCancel={onCancel}
                  />
                ) : (
                  <CategoryRow
                    cat={cat}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                )}
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
}
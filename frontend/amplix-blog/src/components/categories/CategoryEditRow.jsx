import { generateSlug } from "../../utils/slugify";


export const INPUT_CLS =
  "px-4 py-2.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all";

export default function CategoryEditRow({
  id,
  editName,
  setEditName,
  editSlug,
  setEditSlug,
  updating,
  onSave,
  onCancel,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <input
        type="text"
        value={editName}
        autoFocus
        placeholder="Nombre"
        onChange={(e) => {
          setEditName(e.target.value);
          setEditSlug(generateSlug(e.target.value));
        }}
        className={`flex-1 ${INPUT_CLS} text-sm font-medium`}
      />
      <input
        type="text"
        value={editSlug}
        placeholder="slug"
        onChange={(e) => setEditSlug(e.target.value)}
        className={`flex-1 ${INPUT_CLS} font-mono text-sm`}
      />

      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => onSave(id)}
          disabled={updating || !editName.trim() || !editSlug.trim()}
          className="inline-flex cursor-pointer items-center gap-1 px-4 py-2 bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-bold rounded-full transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {updating ? (
            <span className="material-symbols-outlined animate-spin text-[16px]">
              progress_activity
            </span>
          ) : (
            <span className="material-symbols-outlined text-[16px]">check</span>
          )}
          Guardar
        </button>
        <button
          onClick={onCancel}
          disabled={updating}
          className="inline-flex cursor-pointer items-center gap-1 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold rounded-full transition-colors text-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

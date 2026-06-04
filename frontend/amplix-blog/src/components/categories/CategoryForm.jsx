import { INPUT_CLS } from "./CategoryEditRow";
import { generateSlug } from "../../utils/slugify";

export default function CategoryForm({
  newName,
  setNewName,
  newSlug,
  setNewSlug,
  creating,
  createError,
  onSubmit,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl ambient-shadow overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary-container" />

      <div className="p-8 sm:p-10">
        <header className="mb-8 border-b border-outline-variant/30 pb-6">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
            Administrar Categorías
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm">
            Creá, editá y eliminá las categorías del blog.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">

            <div className="space-y-2">
              <label htmlFor="newName" className="block text-sm font-bold text-on-surface">
                Nombre
              </label>
              <input
                id="newName"
                type="text"
                required
                value={newName}
                placeholder="Ej: Programación"
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNewSlug(generateSlug(e.target.value));
                }}
                className={`block w-full ${INPUT_CLS} font-medium`}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="newSlug" className="block text-sm font-bold text-on-surface">
                Slug
                <span className="text-outline font-normal ml-1 text-xs">(auto-generado)</span>
              </label>
              <input
                id="newSlug"
                type="text"
                required
                value={newSlug}
                placeholder="ej: programacion"
                onChange={(e) => setNewSlug(e.target.value)}
                className={`block w-full ${INPUT_CLS} font-mono text-sm`}
              />
            </div>

          </div>

          {createError && (
            <div className="p-4 bg-error/10 text-error rounded-xl text-sm font-medium border border-error/20">
              {createError}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-primary hover:bg-on-primary-fixed-variant text-on-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {creating ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  Creando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Crear categoría
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
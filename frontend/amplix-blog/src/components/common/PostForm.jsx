import React from "react";
import ImageUpload from "./ImageUpload.jsx";

const PostForm = ({
  title,
  setTitle,
  content,
  setContent,
  published,
  setPublished,
  onImageUpload,
  initialImage,
  availableCategories = [],
  selectedCategories = [],
  toggleCategory,
  onSubmit,
  loading,
  error,
  submitLabel = "Guardar Artículo",
  onCancel,
  /** Solo ADMIN y COLLABORATOR pueden publicar directamente */
  canPublish = true,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Título */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-bold text-on-surface">
          Título del artículo
        </label>
        <input
          id="title"
          type="text"
          required
          minLength={3}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Introducción a React Hooks..."
          className="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-medium"
        />
      </div>

      {/* Contenido */}
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-bold text-on-surface">
          Contenido
        </label>
        <textarea
          id="content"
          required
          minLength={10}
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe el contenido de tu artículo aquí..."
          className="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-y"
        />
      </div>

      {/* Categorías */}
      <div className="space-y-3">
        <label className="block text-sm font-bold text-on-surface">Categorías</label>
        {availableCategories.length === 0 ? (
          <p className="text-sm text-outline">Cargando categorías...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-4 py-2 cursor-pointer rounded-full text-sm font-bold border-2 transition-all ${
                    isSelected
                      ? "bg-primary border-primary text-white"
                      : "bg-surface-container-low border-outline-variant text-on-surface-variant hover:border-primary/50"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Imagen de portada */}
      <ImageUpload
        onUpload={onImageUpload}
        initialImage={initialImage}
        onRemove={() => onImageUpload(null)}
      />

      {/* Toggle publicar — solo para ADMIN y COLLABORATOR */}
      {canPublish ? (
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            role="switch"
            aria-checked={published}
            onClick={() => setPublished(!published)}
            className={`relative inline-flex cursor-pointer h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
              published ? "bg-primary" : "bg-outline-variant"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                published ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-sm font-medium text-on-surface">
            {published ? "Publicar inmediatamente" : "Guardar como borrador"}
          </span>
        </div>
      ) : (
        /* USER: siempre borrador, sin opción de publicar */
        <div className="flex items-center gap-3 pt-2 px-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
          <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
          <span className="text-sm font-medium text-on-surface-variant">
            Tu artículo se guardará como{" "}
            <span className="font-bold text-on-surface">borrador</span> para revisión.
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-error/10 text-error rounded-xl text-sm font-medium border border-error/20">
          {error}
        </div>
      )}

      {/* Botones */}
      <div className="pt-6 flex gap-4 border-t border-outline-variant/30">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 cursor-pointer rounded-full font-bold text-on-surface bg-surface-container-high hover:bg-surface-container-highest transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 cursor-pointer px-6 py-3 rounded-full font-bold text-on-primary bg-primary hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">
                progress_activity
              </span>
              Guardando...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;

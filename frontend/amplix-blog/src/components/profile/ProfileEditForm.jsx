import { useState } from "react";
import ImageUpload from "../common/ImageUpload";

const MAX_BIO = 200;

export default function ProfileEditForm({ profile, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    name: profile.name ?? "",
    bio: profile.bio ?? "",
    avatarUrl: profile.avatarUrl ?? "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Convertir strings vacíos a null para que pasen la validación Zod del backend
      await onSave({
        name: form.name,
        bio: form.bio.trim() || null,
        avatarUrl: form.avatarUrl || null,
      });
    } catch (err) {
      setError(err.message || "Error al guardar los cambios");
    }
  };

  const bioLength = form.bio?.length ?? 0;
  const bioNearLimit = bioLength >= MAX_BIO - 20;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-on-surface">Editar perfil</h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-outline hover:text-on-surface transition-colors"
          aria-label="Cancelar edición"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Error global */}
      {error && (
        <p className="text-sm text-error font-medium bg-error/5 px-3 py-2 rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {error}
        </p>
      )}

      {/* ── Avatar ── */}
      <ImageUpload
        circlePreview
        initialImage={form.avatarUrl || undefined}
        onUpload={(url) => setForm((prev) => ({ ...prev, avatarUrl: url ?? "" }))}
        onRemove={() => setForm((prev) => ({ ...prev, avatarUrl: "" }))}
      />

      {/* ── Nombre ── */}
      <div className="space-y-1.5">
        <label htmlFor="edit-name" className="block text-sm font-bold text-on-surface">
          Nombre
        </label>
        <input
          id="edit-name"
          type="text"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          minLength={2}
          required
          className="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
        />
      </div>

      {/* ── Bio ── */}
      <div className="space-y-1.5">
        <label htmlFor="edit-bio" className="block text-sm font-bold text-on-surface">
          Bio{" "}
          <span className="font-normal text-outline">(opcional)</span>
        </label>
        <textarea
          id="edit-bio"
          value={form.bio}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              bio: e.target.value.slice(0, MAX_BIO),
            }))
          }
          maxLength={MAX_BIO}
          rows={3}
          placeholder="Cuéntanos algo sobre ti..."
          className="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
        {/* Contador de caracteres */}
        <p
          className={`text-xs text-right font-medium transition-colors ${
            bioLength >= MAX_BIO
              ? "text-error"
              : bioNearLimit
              ? "text-amber-500"
              : "text-outline"
          }`}
        >
          {bioLength} / {MAX_BIO}
        </p>
      </div>

      {/* ── Acciones ── */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-container transition-colors disabled:opacity-60"
        >
          {saving && (
            <span className="material-symbols-outlined text-[16px] animate-spin">
              progress_activity
            </span>
          )}
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-on-surface-variant text-sm font-semibold hover:text-on-surface transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
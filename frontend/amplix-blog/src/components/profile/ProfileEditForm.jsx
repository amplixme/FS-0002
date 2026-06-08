import { useState } from "react";

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
      await onSave(form);
    } catch (err) {
      setError(err.message || "Error al guardar los cambios");
    }
  };

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      {error && (
        <p className="text-sm text-error font-medium bg-error/5 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Nombre */}
      <div className="space-y-1.5">
        <label htmlFor="edit-name" className="block text-sm font-bold text-on-surface">
          Nombre
        </label>
        <input
          id="edit-name"
          type="text"
          value={form.name}
          onChange={updateField("name")}
          minLength={2}
          required
          className="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
        />
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label htmlFor="edit-bio" className="block text-sm font-bold text-on-surface">
          Bio <span className="font-normal text-outline">(opcional)</span>
        </label>
        <textarea
          id="edit-bio"
          value={form.bio}
          onChange={updateField("bio")}
          maxLength={200}
          rows={3}
          placeholder="Cuéntanos algo sobre ti..."
          className="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
        <p className="text-xs text-outline text-right">
          {form.bio?.length ?? 0} / 200
        </p>
      </div>

      {/* Avatar URL */}
      <div className="space-y-1.5">
        <label htmlFor="edit-avatar" className="block text-sm font-bold text-on-surface">
          URL del avatar <span className="font-normal text-outline">(opcional)</span>
        </label>
        <input
          id="edit-avatar"
          type="url"
          value={form.avatarUrl}
          onChange={updateField("avatarUrl")}
          placeholder="https://..."
          className="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
        />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-container transition-colors disabled:opacity-60"
        >
          {saving && (
            <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
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
import { useState, useEffect } from "react";

export default function UserModal({ isOpen, editData, onClose, onSubmit }) {
  const isEditing = !!editData;

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setForm({
        name: editData?.name ?? "",
        email: editData?.email ?? "",
        password: "",
        role: editData?.role ?? "USER",
      });
    }
  }, [isOpen, editData]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, loading, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.name.trim()) return setError("El nombre es requerido");
    if (!form.email.trim()) return setError("El email es requerido");
    if (!isEditing && !form.password.trim()) return setError("La contraseña es requerida");

    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, role: form.role };
      if (!isEditing) payload.password = form.password;
      await onSubmit(payload);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Bottom-sheet en mobile, modal centrado en sm+ */}
      <div className="relative z-10 bg-white w-full rounded-t-2xl sm:rounded-2xl sm:max-w-md ambient-shadow p-5 sm:p-8">

        {/* Pill indicador — solo mobile */}
        <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-5 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-xl font-bold text-on-surface">
            {isEditing ? "Editar usuario" : "Crear nuevo usuario"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition text-on-surface-variant disabled:opacity-50"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              disabled={loading}
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/30 transition disabled:opacity-60"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="usuario@ejemplo.com"
              disabled={loading}
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/30 transition disabled:opacity-60"
            />
          </div>

          {/* Contraseña (solo al crear) */}
          {!isEditing && (
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/30 transition disabled:opacity-60"
              />
            </div>
          )}

          {/* Selector de rol */}
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              Selector de rol
            </label>
            <div className="flex items-center gap-6">
              {["USER", "ADMIN"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role: r }))}
                  disabled={loading}
                  className="flex items-center gap-2 text-sm font-semibold text-on-surface disabled:opacity-60"
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                      form.role === r
                        ? "border-primary bg-primary"
                        : "border-outline-variant bg-transparent"
                    }`}
                  >
                    {form.role === r && <span className="w-2 h-2 rounded-full bg-white block" />}
                  </span>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-xl">
              <span className="material-symbols-outlined text-error text-[18px]">error</span>
              <p className="text-sm text-error font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-on-surface border border-outline-variant hover:bg-surface-container transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-primary hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <span className="material-symbols-outlined animate-spin text-[16px]">
                progress_activity
              </span>
            )}
            {isEditing ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </div>
    </div>
  );
}

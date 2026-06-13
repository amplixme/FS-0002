import { useEffect } from "react";

export default function ConfirmModal({
  isOpen,
  title = "Confirmar acción",
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
  error = null, // ← nueva prop
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onCancel]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      <div className="relative z-10 bg-surface-container-lowest rounded-2xl ambient-shadow w-full max-w-md p-8 flex flex-col gap-6">
        {/* ── Ícono ── */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error/10 mx-auto">
          <span className="material-symbols-outlined text-error text-[28px]">warning</span>
        </div>

        {/* ── Título ── */}
        <h2 id="confirm-modal-title" className="text-xl font-extrabold text-on-surface text-center">
          {title}
        </h2>

        {/* ── Mensaje ── */}
        {message && (
          <p className="text-sm text-on-surface-variant text-center leading-relaxed">{message}</p>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-error/10 border border-error/20 rounded-xl">
            <span className="material-symbols-outlined text-error text-[18px] flex-shrink-0 mt-0.5">
              error
            </span>
            <p className="text-sm text-error font-medium">{error}</p>
          </div>
        )}

        {/* ── Botones ── */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center cursor-pointer justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center cursor-pointer justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-error hover:bg-error/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
                Eliminando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">delete</span>
                {confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";

/**
 * Modal de confirmación reutilizable.
 *
 * Props:
 * - isOpen       {boolean}  — controla si el modal es visible
 * - title        {string}   — título del modal (opcional)
 * - message      {string}   — mensaje/pregunta que se muestra al usuario
 * - confirmLabel {string}   — texto del botón de confirmación (default: "Eliminar")
 * - cancelLabel  {string}   — texto del botón de cancelar (default: "Cancelar")
 * - onConfirm    {function} — callback al confirmar
 * - onCancel     {function} — callback al cancelar / cerrar
 * - loading      {boolean}  — deshabilita botones mientras se ejecuta la acción
 */
export default function ConfirmModal({
  isOpen,
  title = "Confirmar acción",
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
}) {
  // Cierra el modal con la tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onCancel]);

  // Bloquea el scroll del body mientras el modal está abierto
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
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />

      {/* Panel */}
      <div className="relative z-10 bg-surface-container-lowest rounded-2xl ambient-shadow w-full max-w-md p-8 flex flex-col gap-6">
        {/* Ícono de advertencia */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error/10 mx-auto">
          <span className="material-symbols-outlined text-error text-[28px]">
            warning
          </span>
        </div>

        {/* Título */}
        <h2
          id="confirm-modal-title"
          className="text-xl font-extrabold text-on-surface text-center"
        >
          {title}
        </h2>

        {/* Mensaje */}
        {message && (
          <p className="text-sm text-on-surface-variant text-center leading-relaxed">
            {message}
          </p>
        )}

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm bg-error hover:bg-error/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
                {confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
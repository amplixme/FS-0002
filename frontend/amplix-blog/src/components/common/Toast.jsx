import { useEffect } from "react";

/**
 * Toast flotante reutilizable.
 * Props:
 * - message  {string}           — texto a mostrar
 * - type     {"success"|"error"} — variante visual
 * - onClose  {function}         — callback al cerrar o al expirar
 */
export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full ambient-shadow font-semibold text-sm
        ${isSuccess ? "bg-primary text-white" : "bg-error text-white"}`}
    >
      <span className="material-symbols-outlined text-[20px]">
        {isSuccess ? "check_circle" : "error"}
      </span>
      {message}
      <button
        onClick={onClose}
        className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Cerrar notificación"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}
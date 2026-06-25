export function ErrorMessage({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      {/* Ícono*/}
      <span className="material-symbols-outlined text-5xl text-error">error_outline</span>
      <p className="text-slate-600 text-center text-sm">
        {/* Mensaje*/}
        No se pudieron cargar las publicaciones.
        <br />
        Verificá tu conexión e intentá de nuevo.
      </p>
      {/*Botón de Reintentar*/}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 rounded-full bg-[#024ce2] text-white text-sm font-semibold active:scale-95 transition-transform"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

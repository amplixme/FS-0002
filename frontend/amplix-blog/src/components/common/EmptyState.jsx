
export function EmptyState({ message, actionLabel, onAction }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="material-symbols-outlined text-5xl text-outline">article</span>
            <p className="text-slate-500 text-sm font-medium">{message}</p>
            {onAction && (
                <button onClick={onAction} className="px-6 py-2 rounded-full bg-[#024ce2] text-white text-sm font-semibold active:scale-95 transition-transform">
                    {actionLabel ?? "Volver al inicio"}
                </button>
            )}
        </div>
    )

}
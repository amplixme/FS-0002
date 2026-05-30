
export function EmptyState({message}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="material-symbols-outlined text-5xl text-outline">article</span>
            <p className="text-slate-500 text-sm font-medium">{message}</p>
        </div>        
    )
    
}
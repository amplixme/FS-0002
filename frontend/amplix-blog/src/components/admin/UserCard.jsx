import RoleBadge from "./RoleBadge";

export default function UserCard({ u, currentUserId, onEdit, onChangeRole, onDelete }) {
  return (
    <div className="border border-outline-variant/40 rounded-xl p-4 space-y-3">
      {/* Avatar + info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary text-[20px]">person</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-on-surface text-sm truncate">{u.name}</p>
          <p className="text-xs text-on-surface-variant truncate">{u.email}</p>
        </div>
      </div>

      {/* Rol */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
          ROL
        </span>
        <RoleBadge role={u.role} />
      </div>

      {/* Acciones */}
      <div className="flex items-center border-t border-outline-variant/30 pt-2 gap-2">
        <button
          onClick={onEdit}
          className="flex-1 text-xs font-semibold text-on-surface border border-outline-variant py-1.5 rounded-full hover:bg-surface-container transition text-center"
        >
          Editar
        </button>

        {u.id !== currentUserId && (
          <>
            <button
              onClick={onChangeRole}
              className="flex-1 text-xs font-semibold text-primary py-1.5 hover:underline text-center"
            >
              Cambiar Rol
            </button>
            <div className="w-px h-4 bg-outline-variant" />
            <button
              onClick={onDelete}
              className="flex-1 text-xs font-semibold text-error py-1.5 hover:underline text-center"
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

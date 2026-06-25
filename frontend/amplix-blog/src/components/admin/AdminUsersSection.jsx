import CardSkeleton from "./CardSkeleton";
import RoleBadge from "./RoleBadge";
import UserCard from "./UserCard";

export default function AdminUsersSection({
  users,
  loading,
  currentUser,
  showAll,
  onToggleShowAll,
  onOpenCreate,
  onEdit,
  onChangeRole,
  onDelete,
  formatDate,
}) {
  const visible = showAll ? users : users.slice(0, 2);

  return (
    <section className="bg-surface-container-lowest rounded-2xl ambient-shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-on-surface">Usuarios Recientes</h2>
          {!loading && (
            <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {users.length}
            </span>
          )}
        </div>

        <button
          onClick={onOpenCreate}
          className="flex items-center cursor-pointer gap-1.5 bg-primary text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-primary/90 transition"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">Crear usuario</span>
        </button>

        {!loading && users.length > 2 ? (
          <button
            onClick={onToggleShowAll}
            className="hidden cursor-pointer sm:block text-sm text-primary font-semibold hover:underline"
          >
            {showAll ? "Ver menos" : "Ver todos"}
          </button>
        ) : (
          <div className="hidden sm:block w-16" aria-hidden="true" />
        )}
      </div>

      {/* Content */}
      {loading ? (
        <CardSkeleton rows={2} />
      ) : users.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-8">
          No hay usuarios registrados
        </p>
      ) : (
        <>
          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            {visible.map((u) => (
              <UserCard
                key={u.id}
                u={u}
                currentUserId={currentUser?.id}
                onEdit={() => onEdit(u)}
                onChangeRole={() => onChangeRole(u.id, u.role)}
                onDelete={() => onDelete(u)}
                formatDate={formatDate}
              />
            ))}
            {users.length > 2 && (
              <button
                onClick={onToggleShowAll}
                className="w-full text-sm text-primary font-semibold py-2 hover:underline"
              >
                {showAll ? "Ver menos" : `Ver todos los usuarios (${users.length})`}
              </button>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant">
                  {["Nombre", "Email", "Rol", "Fecha de registro", "Acciones"].map((h) => (
                    <th
                      key={h}
                      className={`text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3
                        ${h === "Email" ? "hidden md:table-cell" : ""}
                        ${h === "Fecha de registro" ? "hidden lg:table-cell" : ""}
                      `}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {visible.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 pr-3 font-medium text-on-surface whitespace-nowrap">
                      {u.name}
                    </td>
                    <td className="py-3 pr-3 text-on-surface-variant hidden md:table-cell whitespace-nowrap">
                      {u.email}
                    </td>
                    <td className="py-3 pr-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="py-3 pr-3 text-on-surface-variant hidden lg:table-cell whitespace-nowrap text-xs">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEdit(u)}
                          className="text-xs cursor-pointer font-semibold text-on-surface border border-outline-variant px-3 py-1.5 rounded-full hover:bg-surface-container transition whitespace-nowrap"
                        >
                          Editar
                        </button>
                        {u.id !== currentUser?.id && (
                          <>
                            <button
                              onClick={() => onChangeRole(u.id, u.role)}
                              className="text-xs cursor-pointer font-semibold text-on-surface border border-outline-variant px-3 py-1.5 rounded-full hover:bg-surface-container transition whitespace-nowrap"
                            >
                              Cambiar rol
                            </button>
                            <button
                              onClick={() => onDelete(u)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-error/10 transition text-error flex-shrink-0"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

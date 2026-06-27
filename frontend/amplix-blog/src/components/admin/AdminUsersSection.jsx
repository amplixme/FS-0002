// frontend/amplix-blog/src/components/admin/AdminUsersSection.jsx

import CardSkeleton from "./CardSkeleton";
import RoleBadge from "./RoleBadge";
import UserCard from "./UserCard";
import Avatar from "../common/Avatar";

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
      {/* ── Header ── */}
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

      {/* ── Content ── */}
      {loading ? (
        <CardSkeleton rows={2} />
      ) : users.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-8">
          No hay usuarios registrados
        </p>
      ) : (
        <>
          {/* ── Mobile ── */}
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

          {/* ── Desktop ── */}
          <div className="hidden sm:block">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-outline-variant">

                  {/* Nombre — siempre visible */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 w-auto">
                    Nombre
                  </th>

                  {/* Email — solo xl */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 w-40 hidden xl:table-cell">
                    Email
                  </th>

                  {/* Rol — siempre visible */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 w-28">
                    Rol
                  </th>

                  {/* Fecha — solo xl */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 w-28 hidden xl:table-cell">
                    Registro
                  </th>

                  {/* Acciones — ancho fijo */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 w-28">
                    Acciones
                  </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {visible.map((u) => (
                  <tr key={u.id}>

                    {/* Nombre + Avatar */}
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar src={u.avatarUrl} name={u.name} size="sm" />
                        <span className="font-medium text-on-surface truncate">
                          {u.name}
                        </span>
                      </div>
                    </td>

                    {/* Email — solo xl */}
                    <td className="py-3 pr-3 text-on-surface-variant hidden xl:table-cell">
                      <span className="truncate block text-xs">{u.email}</span>
                    </td>

                    {/* Rol */}
                    <td className="py-3 pr-3">
                      <RoleBadge role={u.role} />
                    </td>

                    {/* Fecha — solo xl */}
                    <td className="py-3 pr-3 text-on-surface-variant hidden xl:table-cell text-xs whitespace-nowrap">
                      {formatDate(u.createdAt)}
                    </td>

                    {/* ✅ Acciones — íconos en lugar de botones de texto */}
                    <td className="py-3">
                      <div className="flex items-center gap-0.5">

                        {/* Editar */}
                        <button
                          onClick={() => onEdit(u)}
                          className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-surface-container transition text-on-surface-variant"
                          title="Editar usuario"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>

                        {u.id !== currentUser?.id && (
                          <>
                            {/* Cambiar rol */}
                            <button
                              onClick={() => onChangeRole(u.id, u.role)}
                              className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-primary/10 transition text-primary"
                              title="Cambiar rol"
                            >
                              <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                            </button>

                            {/* Eliminar */}
                            <button
                              onClick={() => onDelete(u)}
                              className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-error/10 transition text-error"
                              title="Eliminar usuario"
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
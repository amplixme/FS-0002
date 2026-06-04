import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";
import UserModal from "../components/admin/UserModal";
import * as adminService from "../services/admin.service";

export default function Admin() {
  const { user } = useContext(AuthContext);

  // ── Data ─────────────────────────────────────────────────────────────────
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  // ── Loading ───────────────────────────────────────────────────────────────
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  // ── Ver todos ─────────────────────────────────────────────────────────────
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  // Derived
  const visibleUsers = showAllUsers ? users : users.slice(0, 2);
  const visiblePosts = showAllPosts ? posts : posts.slice(0, 2);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Modals ────────────────────────────────────────────────────────────────
  const [userModal, setUserModal] = useState({ open: false, editData: null });
  const [confirmModal, setConfirmModal] = useState({
    open: false, type: null, id: null, title: "", message: "",
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await adminService.getStats();
      setStats(res.data);
    } catch {
      showToast("Error al cargar estadísticas", "error");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch {
      showToast("Error al cargar usuarios", "error");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoadingPosts(true);
      const res = await adminService.getRecentPosts();
      setPosts(res.data);
    } catch {
      showToast("Error al cargar publicaciones", "error");
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      setLoadingComments(true);
      const res = await adminService.getRecentComments();
      setComments(res.data);
    } catch {
      showToast("Error al cargar comentarios", "error");
    } finally {
      setLoadingComments(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchPosts();
    fetchComments();
  }, [fetchStats, fetchUsers, fetchPosts, fetchComments]);

  // ── User actions ──────────────────────────────────────────────────────────
  const handleCreateUser = async (data) => {
    await adminService.createUser(data);
    showToast("Usuario creado correctamente");
    fetchUsers();
    fetchStats();
  };

  const handleEditUser = async (id, data) => {
    await adminService.updateUser(id, data);
    showToast("Usuario actualizado correctamente");
    fetchUsers();
  };

  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      await adminService.changeRole(userId, newRole);
      showToast("Rol actualizado correctamente");
      fetchUsers();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  // ── Delete helpers ────────────────────────────────────────────────────────
  const openConfirm = (type, id, title, message) => {
    setConfirmError(null);
    setUserModal({ open: false, editData: null }); // ← cierra UserModal si estaba abierto
    setConfirmModal({ open: true, type, id, title, message });
  };

  const handleConfirmDelete = async () => {
    setConfirmLoading(true);
    setConfirmError(null);
    try {
      if (confirmModal.type === "user") {
        await adminService.deleteUser(confirmModal.id);
        fetchUsers(); fetchStats(); fetchPosts(); fetchComments();
        showToast("Usuario eliminado correctamente");
      } else if (confirmModal.type === "post") {
        await adminService.deletePost(confirmModal.id);
        fetchPosts(); fetchStats();
        showToast("Publicación eliminada correctamente");
      } else if (confirmModal.type === "comment") {
        await adminService.deleteComment(confirmModal.id);
        fetchComments(); fetchStats();
        showToast("Comentario eliminado correctamente");
      }
      setConfirmModal({ open: false, type: null, id: null, title: "", message: "" });
    } catch (e) {
      setConfirmError(e.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit", month: "short", year: "numeric",
    });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16 space-y-8">

        {/* Page title */}
        <div>
          <h1 className="text-3xl font-bold text-on-surface">
            Panel de Administración
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Bienvenido de nuevo. Aquí tienes un resumen del estado de la plataforma.
          </p>
        </div>

        {/* ── Stats ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatCard
            icon="group" label="Usuarios"
            value={stats?.totalUsers} sub="↑ 12% este mes"
            loading={loadingStats}
          />
          <StatCard
            icon="article" label="Posts"
            value={stats?.totalPosts}
            sub={`+ ${stats?.weekPosts ?? 0} nuevos esta semana`}
            loading={loadingStats}
          />
          <StatCard
            icon="chat" label="Comentarios"
            value={stats?.totalComments} sub="Actualizado hace 5m"
            loading={loadingStats}
          />
          <StatCard
            icon="calendar_month" label="Esta semana"
            value={stats?.weekPosts} sub="Objetivo cumplido"
            subGreen loading={loadingStats}
          />
        </div>

        {/* ── Main grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left col */}
          <div className="lg:col-span-2 space-y-8">

            {/* ── Users ── */}
            <section className="bg-surface-container-lowest rounded-2xl ambient-shadow p-6">

              {/* CAMBIO 1: header de 3 columnas justify-between */}
              <div className="flex items-center justify-between mb-5">

                {/* Izquierda: título + badge */}
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-on-surface">
                    Usuarios Recientes
                  </h2>
                  {!loadingUsers && (
                    <span className="bg-primary text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {users.length}
                    </span>
                  )}
                </div>

                {/* Centro: botón crear usuario */}
                <button
                  onClick={() => setUserModal({ open: true, editData: null })}
                  className="flex items-center gap-1.5 bg-primary text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-primary/90 transition"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span className="hidden sm:inline">Crear usuario</span>
                </button>

                {/* Derecha: ver todos (solo desktop) */}
                {!loadingUsers && users.length > 2 ? (
                  <button
                    onClick={() => setShowAllUsers((v) => !v)}
                    className="hidden sm:block text-sm text-primary font-semibold hover:underline"
                  >
                    {showAllUsers ? "Ver menos" : "Ver todos"}
                  </button>
                ) : (
                  /* Placeholder invisible para mantener el justify-between de 3 columnas */
                  <div className="hidden sm:block w-16" aria-hidden="true" />
                )}

              </div>

              {loadingUsers ? (
                <CardSkeleton rows={2} />
              ) : users.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-8">
                  No hay usuarios registrados
                </p>
              ) : (
                <>
                  {/* Mobile: cards */}
                  <div className="sm:hidden space-y-3">
                    {visibleUsers.map((u) => (
                      <UserCard
                        key={u.id}
                        u={u}
                        currentUserId={user?.id}
                        onEdit={() => setUserModal({ open: true, editData: u })}
                        onChangeRole={() => handleChangeRole(u.id, u.role)}
                        onDelete={() =>
                          openConfirm(
                            "user", u.id,
                            "Eliminar usuario",
                            `¿Eliminar a "${u.name}"? También se eliminarán todos sus posts y comentarios.`
                          )
                        }
                        formatDate={formatDate}
                      />
                    ))}

                    {users.length > 2 && (
                      <button
                        onClick={() => setShowAllUsers((v) => !v)}
                        className="w-full text-sm text-primary font-semibold py-2 hover:underline"
                      >
                        {showAllUsers
                          ? "Ver menos"
                          : `Ver todos los usuarios (${users.length})`}
                      </button>
                    )}
                  </div>

                  {/* Desktop: tabla */}
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
                        {visibleUsers.map((u) => (
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
                                  onClick={() => setUserModal({ open: true, editData: u })}
                                  className="text-xs font-semibold text-on-surface border border-outline-variant px-3 py-1.5 rounded-full hover:bg-surface-container transition whitespace-nowrap"
                                >
                                  Editar
                                </button>
                                {u.id !== user?.id && (
                                  <>
                                    <button
                                      onClick={() => handleChangeRole(u.id, u.role)}
                                      className="text-xs font-semibold text-on-surface border border-outline-variant px-3 py-1.5 rounded-full hover:bg-surface-container transition whitespace-nowrap"
                                    >
                                      Cambiar rol
                                    </button>
                                    <button
                                      onClick={() =>
                                        openConfirm(
                                          "user", u.id,
                                          "Eliminar usuario",
                                          `¿Eliminar a "${u.name}"? También se eliminarán todos sus posts y comentarios.`
                                        )
                                      }
                                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-error/10 transition text-error flex-shrink-0"
                                    >
                                      <span className="material-symbols-outlined text-[18px]">
                                        delete
                                      </span>
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

            {/* ── Posts ── */}
            <section className="bg-surface-container-lowest rounded-2xl ambient-shadow p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-on-surface">
                  Post Recientes
                </h2>
                {/* CAMBIO 2: hidden sm:block evita duplicado en mobile */}
                {!loadingPosts && posts.length > 2 && (
                  <button
                    onClick={() => setShowAllPosts((v) => !v)}
                    className="hidden sm:block text-sm text-primary font-semibold hover:underline"
                  >
                    {showAllPosts ? "Ver menos" : "Ver todos"}
                  </button>
                )}
              </div>

              {loadingPosts ? (
                <CardSkeleton rows={2} />
              ) : posts.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-8">
                  No hay publicaciones
                </p>
              ) : (
                <>
                  {/* Mobile: cards */}
                  <div className="sm:hidden space-y-3">
                    {visiblePosts.map((p) => (
                      <PostCard
                        key={p.id}
                        p={p}
                        onDelete={() =>
                          openConfirm(
                            "post", p.id,
                            "Eliminar publicación",
                            `¿Eliminar "${p.title}"? Esta acción no se puede deshacer.`
                          )
                        }
                        formatDate={formatDate}
                      />
                    ))}

                    {posts.length > 2 && (
                      <button
                        onClick={() => setShowAllPosts((v) => !v)}
                        className="w-full text-sm text-primary font-semibold py-2 hover:underline"
                      >
                        {showAllPosts
                          ? "Ver menos"
                          : `Ver todos los posts (${posts.length})`}
                      </button>
                    )}
                  </div>

                  {/* Desktop: tabla */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-outline-variant">
                          <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3">
                            Título
                          </th>
                          <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 hidden sm:table-cell">
                            Autor
                          </th>
                          <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 hidden md:table-cell">
                            Categorías
                          </th>
                          <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 hidden sm:table-cell">
                            Fecha
                          </th>
                          <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/40">
                        {visiblePosts.map((p) => (
                          <tr key={p.id}>
                            <td className="py-3 pr-3">
                              <div className="flex items-center gap-3">
                                {p.coverImage ? (
                                  <img
                                    src={p.coverImage} alt=""
                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                                      image
                                    </span>
                                  </div>
                                )}
                                <span className="font-medium text-on-surface line-clamp-2 max-w-[180px]">
                                  {p.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 pr-3 text-on-surface-variant whitespace-nowrap hidden sm:table-cell">
                              {p.author?.name}
                            </td>
                            <td className="py-3 pr-3 hidden md:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {p.categories?.slice(0, 2).map((c) => (
                                  <span
                                    key={c.id}
                                    className="text-xs bg-secondary-container/30 text-secondary px-2 py-0.5 rounded-full font-semibold uppercase"
                                  >
                                    {c.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 pr-3 text-on-surface-variant whitespace-nowrap text-xs hidden sm:table-cell">
                              {formatDate(p.createdAt)}
                            </td>
                            <td className="py-3">
                              <button
                                onClick={() =>
                                  openConfirm(
                                    "post", p.id,
                                    "Eliminar publicación",
                                    `¿Eliminar "${p.title}"? Esta acción no se puede deshacer.`
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-error/10 transition text-error"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  delete
                                </span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* {posts.length > 2 && (
                      <div className="mt-4 pt-4 border-t border-outline-variant/40 text-center">
                        <button
                          onClick={() => setShowAllPosts((v) => !v)}
                          className="text-sm text-primary font-semibold hover:underline"
                        >
                          {showAllPosts
                            ? "Ver menos"
                            : `(${posts.length})`}
                        </button>
                      </div>
                    )} */}
                  </div>
                </>
              )}
            </section>
          </div>

          {/* ── Comments ── */}
          <div>
            <section className="bg-surface-container-lowest rounded-2xl ambient-shadow p-6">
              <h2 className="text-lg font-bold text-on-surface mb-5">
                Comentarios Recientes
              </h2>

              {loadingComments ? (
                <div className="space-y-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="h-4 bg-surface-container rounded w-full" />
                      <div className="h-4 bg-surface-container rounded w-4/5" />
                      <div className="h-3 bg-surface-container rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-8">
                  No hay comentarios
                </p>
              ) : (
                <div className="divide-y divide-outline-variant/40">
                  {comments.map((c) => (
                    <div key={c.id} className="py-4 first:pt-0 last:pb-0">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                            account_circle
                          </span>
                          <span className="text-sm font-semibold text-on-surface">
                            {c.author?.name}
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant/60">
                          {formatDate(c.createdAt)}
                        </span>
                      </div>

                      {/* Contenido */}
                      <p className="text-sm text-on-surface italic line-clamp-3 leading-relaxed mb-2">
                        "{c.content}"
                      </p>

                      {/* Post relacionado */}
                      <p className="text-xs text-on-surface-variant/60 truncate mb-3">
                        En: {c.post?.title}
                      </p>

                      {/* Acción */}
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            openConfirm(
                              "comment", c.id,
                              "Eliminar comentario",
                              "¿Eliminar este comentario? Esta acción no se puede deshacer."
                            )
                          }
                          className="text-xs font-semibold text-error hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      <UserModal
        isOpen={userModal.open}
        editData={userModal.editData}
        onClose={() => setUserModal({ open: false, editData: null })}
        onSubmit={
          userModal.editData
            ? (data) => handleEditUser(userModal.editData.id, data)
            : handleCreateUser
        }
      />

      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setConfirmModal({ open: false, type: null, id: null, title: "", message: "" })
        }
        loading={confirmLoading}
        error={confirmError}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// ── UserCard (mobile) ─────────────────────────────────────────────────────────
function UserCard({ u, currentUserId, onEdit, onChangeRole, onDelete }) {
  return (
    <div className="border border-outline-variant/40 rounded-xl p-4 space-y-3">
      {/* Avatar + info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-primary text-[20px]">
            person
          </span>
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

// ── PostCard (mobile) ─────────────────────────────────────────────────────────
function PostCard({ p, onDelete, formatDate }) {
  return (
    <div className="border border-outline-variant/40 rounded-xl overflow-hidden">
      <div className="flex gap-3 p-4">
        {p.coverImage ? (
          <img
            src={p.coverImage} alt=""
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">
              image
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          {p.categories?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {p.categories.slice(0, 2).map((c) => (
                <span
                  key={c.id}
                  className="text-xs font-bold text-secondary uppercase tracking-wide"
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}
          <p className="font-semibold text-on-surface text-sm line-clamp-2 leading-snug">
            {p.title}
          </p>
        </div>
      </div>

      {/* Meta */}
      <div className="px-4 pb-3 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-on-surface-variant/60 uppercase font-semibold tracking-wide">
            Autor
          </p>
          <p className="text-sm text-on-surface">{p.author?.name}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant/60 uppercase font-semibold tracking-wide">
            Fecha
          </p>
          <p className="text-sm text-on-surface">{formatDate(p.createdAt)}</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center border-t border-outline-variant/30">
        <button
          onClick={onDelete}
          className="flex-1 text-xs font-semibold text-error py-3 hover:underline text-center"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, subGreen = false, loading }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl ambient-shadow p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-on-surface-variant">{label}</p>
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        </div>
      </div>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-9 bg-surface-container rounded w-24 mb-2" />
          <div className="h-3 bg-surface-container rounded w-32" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-extrabold text-on-surface mb-1">
            {value != null ? value.toLocaleString("es-AR") : "—"}
          </p>
          {sub && (
            <p className={`text-xs font-medium flex items-center gap-1 ${subGreen ? "text-green-600" : "text-on-surface-variant"}`}>
              {subGreen && (
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
              )}
              {sub}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ── RoleBadge ─────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  return (
    <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
      role === "ADMIN"
        ? "bg-primary text-white"
        : "bg-surface-container-high text-on-surface-variant"
    }`}>
      {role}
    </span>
  );
}

// ── CardSkeleton ──────────────────────────────────────────────────────────────
function CardSkeleton({ rows = 2 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border border-outline-variant/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-surface-container rounded w-3/4" />
              <div className="h-3 bg-surface-container rounded w-1/2" />
            </div>
          </div>
          <div className="h-3 bg-surface-container rounded w-full" />
        </div>
      ))}
    </div>
  );
}
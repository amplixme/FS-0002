import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import Toast from "../components/common/Toast";
import ConfirmModal from "../components/common/ConfirmModal";
import UserModal from "../components/admin/UserModal";

import AdminStatsGrid from "../components/admin/AdminStatsGrid";
import AdminUsersSection from "../components/admin/AdminUsersSection";
import AdminPostsSection from "../components/admin/AdminPostsSection";
import AdminCommentsSection from "../components/admin/AdminCommentsSection";

import { useAdminData } from "../hooks/useAdminData";
import * as adminService from "../services/admin.service";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Admin() {
  const { user } = useContext(AuthContext);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    stats,
    users,
    posts,
    comments,
    loadingStats,
    loadingUsers,
    loadingPosts,
    loadingComments,
    fetchStats,
    fetchUsers,
    fetchPosts,
    fetchComments,
  } = useAdminData(showToast);

  // ── Ver todos ─────────────────────────────────────────────────────────────
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  // ── Modals ────────────────────────────────────────────────────────────────
  const [userModal, setUserModal] = useState({ open: false, editData: null });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null,
    id: null,
    title: "",
    message: "",
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const openConfirm = (type, id, title, message) => {
    setConfirmError(null);
    setConfirmModal({ open: true, type, id, title, message });
  };

  const closeConfirm = () =>
    setConfirmModal({ open: false, type: null, id: null, title: "", message: "" });

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
    try {
      await adminService.changeRole(userId, currentRole === "ADMIN" ? "USER" : "ADMIN");
      showToast("Rol actualizado correctamente");
      fetchUsers();
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  // ── Confirm delete ────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    setConfirmLoading(true);
    setConfirmError(null);
    try {
      if (confirmModal.type === "user") {
        await adminService.deleteUser(confirmModal.id);
        fetchUsers();
        fetchStats();
        fetchPosts();
        fetchComments();
        showToast("Usuario eliminado correctamente");
      } else if (confirmModal.type === "post") {
        await adminService.deletePost(confirmModal.id);
        fetchPosts();
        fetchStats();
        showToast("Publicación eliminada correctamente");
      } else if (confirmModal.type === "comment") {
        await adminService.deleteComment(confirmModal.id);
        fetchComments();
        fetchStats();
        showToast("Comentario eliminado correctamente");
      }
      closeConfirm();
    } catch (e) {
      setConfirmError(e.message);
    } finally {
      setConfirmLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Panel de Administración</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Bienvenido de nuevo. Aquí tienes un resumen del estado de la plataforma.
          </p>
        </div>

        <AdminStatsGrid stats={stats} loading={loadingStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AdminUsersSection
              users={users}
              loading={loadingUsers}
              currentUser={user}
              showAll={showAllUsers}
              onToggleShowAll={() => setShowAllUsers((v) => !v)}
              onOpenCreate={() => setUserModal({ open: true, editData: null })}
              onEdit={(u) => setUserModal({ open: true, editData: u })}
              onChangeRole={handleChangeRole}
              onDelete={(u) =>
                openConfirm(
                  "user",
                  u.id,
                  "Eliminar usuario",
                  `¿Eliminar a "${u.name}"? También se eliminarán todos sus posts y comentarios.`
                )
              }
              formatDate={formatDate}
            />

            <AdminPostsSection
              posts={posts}
              loading={loadingPosts}
              showAll={showAllPosts}
              onToggleShowAll={() => setShowAllPosts((v) => !v)}
              onDelete={(p) =>
                openConfirm(
                  "post",
                  p.id,
                  "Eliminar publicación",
                  `¿Eliminar "${p.title}"? Esta acción no se puede deshacer.`
                )
              }
              formatDate={formatDate}
            />
          </div>

          <AdminCommentsSection
            comments={comments}
            loading={loadingComments}
            onDelete={(c) =>
              openConfirm(
                "comment",
                c.id,
                "Eliminar comentario",
                "¿Eliminar este comentario? Esta acción no se puede deshacer."
              )
            }
            formatDate={formatDate}
          />
        </div>
      </div>

      {/* ── Modals ── */}
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
        onCancel={closeConfirm}
        loading={confirmLoading}
        error={confirmError}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

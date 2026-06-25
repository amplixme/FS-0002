import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getPendingPosts,
  publishPost,
  rejectPost,
} from "../services/collaborator.service";
import { formatRelativeTime } from "../utils/dateFormatter";
import ConfirmModal from "../components/common/ConfirmModal";
import { sileo } from "sileo";

export default function Collaborator() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal de rechazo
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);

  // ID del post que está siendo procesado (publish o reject)
  const [actionLoading, setActionLoading] = useState(null);

  /* ── Carga de datos ── */
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getPendingPosts();
      setPosts(result.data ?? result ?? []);
    } catch (err) {
      setError(err.message || "Error al cargar los borradores pendientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ── Acciones ── */
  const handlePublish = async (post) => {
    setActionLoading(post.id);
    try {
      await publishPost(post.id);
      await fetchPosts();
      sileo.success({
        title: "Post publicado correctamente",
        fill: "#171717",
        styles: { title: "text-white!" },
      });
    } catch (err) {
      sileo.error({
        title: "Error al publicar",
        description: err.message || "Intentá de nuevo más tarde.",
        fill: "#171717",
        styles: { title: "text-white!", description: "text-white/75!" },
      });
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (post) => {
    setRejectTarget(post);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setActionLoading(rejectTarget.id);
    try {
      await rejectPost(rejectTarget.id);
      setShowRejectModal(false);
      setRejectTarget(null);
      await fetchPosts();
      sileo.success({
        title: "Borrador rechazado",
        fill: "#171717",
        styles: { title: "text-white!" },
      });
    } catch (err) {
      sileo.error({
        title: "Error al rechazar",
        description: err.message || "Intentá de nuevo más tarde.",
        fill: "#171717",
        styles: { title: "text-white!", description: "text-white/75!" },
      });
    } finally {
      setActionLoading(null);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-primary font-medium">
          <span className="material-symbols-outlined animate-spin text-[28px]">
            progress_activity
          </span>
          Cargando borradores...
        </div>
      </div>
    );
  }

  /* ── Vista principal ── */
  return (
    <>
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
        <main className="max-w-5xl mx-auto">

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container">
                Colaborador
              </span>
              <span className="text-outline text-sm font-medium">Panel de revisión</span>
            </div>
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
              Borradores Pendientes
            </h1>
            <p className="text-on-surface-variant mt-1">
              Revisá, editá, publicá o rechazá los artículos enviados por los usuarios.
            </p>
          </header>

          {/* Error global */}
          {error && (
            <div className="p-4 bg-error/10 text-error rounded-xl text-sm font-medium border border-error/20 mb-6">
              {error}
            </div>
          )}

          {/* Empty state */}
          {posts.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-surface-container-lowest rounded-2xl ambient-shadow">
              <span className="material-symbols-outlined text-6xl text-outline mb-4">
                task_alt
              </span>
              <h2 className="text-xl font-bold text-on-surface mb-2">Todo al día</h2>
              <p className="text-on-surface-variant text-sm">
                No hay borradores pendientes de revisión.
              </p>
            </div>
          ) : (
            <>
              {/* Contador */}
              <p className="text-sm text-outline font-medium mb-4">
                {posts.length} artículo{posts.length !== 1 ? "s" : ""} pendiente
                {posts.length !== 1 ? "s" : ""}
              </p>

              <div className="space-y-4">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-surface-container-lowest rounded-2xl ambient-shadow overflow-hidden"
                  >
                    {/* Barra de color */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-secondary-container to-primary/30" />

                    <div className="p-6">
                      {/* Título + badge borrador */}
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h2 className="text-lg font-extrabold text-on-surface leading-tight flex-1 min-w-0">
                          {post.title}
                        </h2>
                        <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/40 whitespace-nowrap">
                          Borrador
                        </span>
                      </div>

                      {/* Autor + fecha */}
                      <div className="flex items-center gap-1.5 text-sm text-outline mb-3">
                        <span className="material-symbols-outlined text-[15px]">person</span>
                        <span className="font-medium">{post.author?.name}</span>
                        <span>·</span>
                        <span>{formatRelativeTime(post.createdAt)}</span>
                      </div>

                      {/* Categorías */}
                      {post.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.categories.map((cat) => (
                            <span
                              key={cat.id}
                              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Extracto */}
                      <p className="text-sm text-on-surface-variant line-clamp-2 mb-5">
                        {post.content}
                      </p>

                      {/* Acciones */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/posts/${post.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold rounded-full transition-colors text-sm"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Revisar y editar
                        </Link>

                        <button
                          onClick={() => handlePublish(post)}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-on-primary-fixed-variant disabled:opacity-60 text-on-primary font-bold rounded-full transition-colors text-sm cursor-pointer disabled:cursor-not-allowed"
                        >
                          {actionLoading === post.id ? (
                            <span className="material-symbols-outlined animate-spin text-[16px]">
                              progress_activity
                            </span>
                          ) : (
                            <span className="material-symbols-outlined text-[16px]">publish</span>
                          )}
                          Publicar
                        </button>

                        <button
                          onClick={() => openRejectModal(post)}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-error/10 hover:bg-error/20 disabled:opacity-60 text-error font-bold rounded-full transition-colors text-sm cursor-pointer disabled:cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modal de confirmación de rechazo */}
      <ConfirmModal
        isOpen={showRejectModal}
        title="Rechazar borrador"
        message={`¿Estás seguro de que querés rechazar y eliminar "${rejectTarget?.title}"? Esta acción no se puede deshacer.`}
        confirmLabel="Rechazar y eliminar"
        onConfirm={handleReject}
        onCancel={() => {
          if (actionLoading) return;
          setShowRejectModal(false);
          setRejectTarget(null);
        }}
        loading={actionLoading === rejectTarget?.id}
      />
    </>
  );
}

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getByPostId, create, update, remove } from "../../services/comment.service";
import { formatRelativeTime } from "../../utils/dateFormatter";
import ConfirmModal from "../common/ConfirmModal";
import { sileo } from "sileo";
import Avatar from "../common/Avatar";

export default function CommentSection({ postId }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  /** Roles con capacidad de moderar (borrar cualquier comentario) */
  const isModerator = user?.role === "ADMIN" || user?.role === "COLLABORATOR";

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getByPostId(postId);
      setComments(data.data || data || []);
    } catch (error) {
      // ✅ Corregido: Al menos notificar al usuario si falla la carga
      sileo.error({
        title: "Error al cargar comentarios",
        description: "No se pudieron obtener los comentarios.",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleUpdate = async (id) => {
    try {
      await update(id, { content: editContent });
      cancelEdit();
      await fetchComments();
      sileo.success({
        title: "Comentario actualizado",
        duration: 3000,
      });
    } catch (err) {
      sileo.error({
        title: "No se pudo actualizar el comentario",
        description: err.message || "Intentá de nuevo más tarde.",
        duration: 3000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await remove(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      await fetchComments();
      sileo.success({
        title: "Comentario eliminado",
        duration: 3000,
      });
    } catch (err) {
      sileo.error({
        title: "No se pudo eliminar el comentario",
        description: err.message || "Intentá de nuevo más tarde.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await create(postId, newComment);
      setNewComment("");
      sileo.success({
        title: "Comentario creado correctamente",
      });
      await fetchComments();
    } catch (err) {
      sileo.error({
        title: "Error al crear comentario",
        description: err.message || "Intentá de nuevo más tarde.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-8 sm:px-12 pb-12 border-t border-outline-variant/30 pt-8">
      <h3 className="font-bold text-lg mb-4">Comentarios</h3>

      <div className="space-y-4 mb-8">
        {loading ? (
          <p className="text-outline">Cargando comentarios...</p>
        ) : comments.length === 0 ? (
          <p className="text-on-surface-variant text-sm italic">
            Aún no hay comentarios. ¡Sé el primero!
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-start gap-3 mb-1">
                {/* ✅ Avatar del autor del comentario */}
                <Avatar src={c.author?.avatarUrl} name={c.author?.name} size="sm" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-on-surface">{c.author?.name}</p>
                    {isModerator && user?.id !== c.authorId && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                        moderación
                      </span>
                    )}
                  </div> {/* ✅ Cierre del flex items-center original que faltaba */}

                  {editingId === c.id ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 bg-surface-container border border-outline-variant/40 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(c.id)}
                          className="px-4 py-1.5 bg-primary text-white rounded-full text-sm font-bold"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-1.5 bg-surface-container-high text-on-surface rounded-full text-sm font-bold"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-on-surface-variant mt-1">{c.content}</p>
                      <p className="text-xs text-outline mt-2">{formatRelativeTime(c.createdAt)}</p>

                      <div className="flex gap-3 mt-2">
                        {/* Editar: solo el propio autor */}
                        {user?.id === c.authorId && (
                          <button
                            onClick={() => startEdit(c)}
                            className="text-xs font-bold cursor-pointer text-primary hover:underline"
                          >
                            Editar
                          </button>
                        )}
                        {/* Eliminar: autor del comentario + moderadores (ADMIN / COLLABORATOR) */}
                        {(user?.id === c.authorId || isModerator) && (
                          <button
                            onClick={() => {
                              setDeleteTarget(c);
                              setShowDeleteModal(true);
                            }}
                            className="text-xs font-bold cursor-pointer text-error hover:underline"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div> {/* ✅ Cierre de flex-1 min-w-0 */}
              </div> {/* ✅ Cierre de flex items-start */}
            </div> /* ✅ Cierre del contenedor del comentario del .map() */
          ))
        )}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-4 bg-surface-container-low border border-outline-variant/40 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Escribe un comentario..."
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="bg-primary text-white px-6 py-2.5 cursor-pointer rounded-full font-bold text-sm disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Comentar"}
          </button>
        </form>
      ) : (
        <p className="text-sm font-medium text-outline">
          <Link to="/login" className="text-primary hover:underline font-medium">
            Inicia sesión
          </Link>{" "}
          para comentar
        </p>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Eliminar comentario"
        message="¿Estás seguro de que querés eliminar este comentario? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
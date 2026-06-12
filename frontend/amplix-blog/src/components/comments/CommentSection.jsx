import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  getByPostId,
  create,
  update,
  remove,
} from "../../services/comment.service";
import { formatRelativeTime } from "../../utils/dateFormatter";
import ConfirmModal from "../common/ConfirmModal";
import { sileo } from "sileo";

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

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getByPostId(postId);
      setComments(data.data || data || []);
    } catch (error) {
      console.error(error);
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
      sileo.success({ title: "Comentario actualizado" });
    } catch (err) {
      sileo.error({
        title: "No se pudo actualizar el comentario",
        description: err.message || "Intentá de nuevo más tarde.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await remove(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      await fetchComments();
      sileo.success({ title: "Comentario eliminado" });
    } catch (err) {
      sileo.error({
        title: "No se pudo eliminar el comentario",
        description: err.message || "Intentá de nuevo más tarde.",
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
      await fetchComments();
    } catch (err) {
      console.error("Error al publicar:", err);
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
              <p className="font-bold text-sm text-on-surface">
                {c.author.name}
              </p>

              {editingId === c.id ? (
                // Modo edición
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
                // Modo normal
                <>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {c.content}
                  </p>
                  <p className="text-xs text-outline mt-2">
                    {formatRelativeTime(c.createdAt)}
                  </p>
                  {user?.id === c.authorId && (
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="text-xs font-bold cursor-pointer text-primary hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(c);
                          setShowDeleteModal(true);
                        }}
                        className="text-xs font-bold cursor-pointer text-error hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
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
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
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

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getByPostId, create } from "../../services/comment.service";
import { formatRelativeTime } from "../../utils/dateFormatter";

export default function CommentSection({ postId }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
              <p className="text-sm text-on-surface-variant mt-1">
                {c.content}
              </p>
              <p className="text-xs text-outline mt-2">
                {formatRelativeTime(c.createdAt)}
              </p>
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
            className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm disabled:opacity-50"
          >
            {submitting ? "Enviando..." : "Comentar"}
          </button>
        </form>
      ) : (
        <p className="text-sm font-medium text-outline">
          Inicia sesión para comentar
        </p>
      )}
    </div>
  );
}

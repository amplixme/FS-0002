import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getPostById } from "../services/post.service";
import ConfirmModal from "../components/common/ConfirmModal";
import Toast from "../components/common/Toast";
import { useDeletePost } from "../hooks/useDeletePost";
import { formatRelativeTime } from "../utils/dateFormatter";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    showModal,
    deleting,
    toast,
    openModal,
    cancelModal,
    confirmDelete,
    clearToast,
  } = useDeletePost(id);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await getPostById(id);
        setPost(result.data ?? result);
      } catch (err) {
        setError(err.message || "Error al cargar el artículo");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-primary font-medium">
          <span className="material-symbols-outlined animate-spin text-[28px]">
            progress_activity
          </span>
          Cargando artículo...
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-error font-bold text-xl">
          {error || "Artículo no encontrado"}
        </p>
        <Link to="/" className="text-primary hover:underline font-medium">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  const isAuthor = user?.id === post.authorId;

  return (
    <>
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
        <main className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-bold text-primary hover:text-on-primary-fixed-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px] mr-1">
                arrow_back
              </span>
              Volver a inicio
            </Link>
          </div>

          <article className="bg-surface-container-lowest rounded-2xl ambient-shadow overflow-hidden">
            {/* Imagen de portada */}
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                loading="lazy"
                className="w-full aspect-[16/9] object-cover"
              />
            ) : (
              <div className="w-full aspect-[16/9] bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-outline">
                  article
                </span>
              </div>
            )}
            <div className="p-8 sm:p-12">
              <header className="mb-8 border-b border-outline-variant/30 pb-8">
                <h1 className="text-4xl font-extrabold text-on-surface tracking-tight mb-6 leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold uppercase">
                    {post.author?.name ? post.author.name.charAt(0) : "U"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      {post.author?.name || "Usuario Anónimo"}
                    </p>
                    <p className="text-xs font-medium text-outline">
                      {formatRelativeTime(post.createdAt)}
                    </p>
                  </div>
                </div>
              </header>

              <div className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed">
                {(post.content || "").split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {isAuthor && (
                <div className="flex items-center justify-center gap-3 mt-10 pt-8 border-t border-outline-variant/30">
                  <button
                    onClick={() => alert("Acá iría a la vista de editar")}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold rounded-full transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                    Editar
                  </button>
                  <button
                    onClick={openModal}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-error/10 hover:bg-error/20 text-error font-bold rounded-full transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </article>
        </main>
      </div>

      <ConfirmModal
        isOpen={showModal}
        title="Eliminar artículo"
        message="¿Estás seguro de que deseas eliminar este artículo? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onCancel={cancelModal}
        loading={deleting}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}
    </>
  );
}

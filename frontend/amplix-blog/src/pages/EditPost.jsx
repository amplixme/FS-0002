import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getPostById, updatePost } from "../services/post.service";
import { getAll } from "../services/category.service";
import PostForm from "../components/common/PostForm";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // ADMIN y COLLABORATOR pueden cambiar el estado de publicación
  const canPublish = user?.role === "ADMIN" || user?.role === "COLLABORATOR";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResult, categoriesResult] = await Promise.all([
          getPostById(id),
          getAll(),
        ]);

        const post = postResult.data ? postResult.data : postResult;

        /* ── Verificación de permisos ──
         * - ADMIN: puede editar cualquier post
         * - COLLABORATOR: sus propios posts + borradores de USER
         * - USER: solo sus propios borradores (no publicados)
         */
        const isAuthor = user.id === post.authorId;
        const isAdmin = user.role === "ADMIN";
        const isCollaboratorOnUserDraft =
          user.role === "COLLABORATOR" &&
          post.author?.role === "USER" &&
          !post.published;
        const isUserOnOwnDraft =
          user.role === "USER" && isAuthor && !post.published;

        if (!isAdmin && !isAuthor && !isCollaboratorOnUserDraft) {
          navigate("/");
          return;
        }

        // USER no puede editar posts ya publicados
        if (user.role === "USER" && isAuthor && post.published) {
          navigate(`/posts/${id}`);
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setPublished(post.published);
        if (post.coverImage) setCoverImage(post.coverImage);

        setAvailableCategories(categoriesResult.data ?? []);
        if (post.categories?.length > 0) {
          setSelectedCategories(post.categories.map((cat) => cat.id));
        }
      } catch (error) {
        setError(error.message || "Error al cargar los datos del artículo");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, user.id, user.role, navigate]);

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updatePost(id, {
        title,
        content,
        published: String(published),
        ...(coverImage && { coverImage }),
        categories: JSON.stringify(selectedCategories),
      });
      navigate(`/posts/${id}`);
    } catch (error) {
      setError(error.message || "Error al actualizar el artículo");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-3xl mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl ambient-shadow overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary-container"></div>
          <div className="p-8 sm:p-10">
            <header className="mb-8 border-b border-outline-variant/30 pb-6">
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
                Editar Artículo
              </h1>
              <p className="text-on-surface-variant mt-2">
                {canPublish
                  ? "Modificá y publicá el artículo cuando esté listo."
                  : "Modificá el contenido de tu artículo en borrador."}
              </p>
            </header>

            <PostForm
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              published={published}
              setPublished={setPublished}
              onImageUpload={setCoverImage}
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              onSubmit={handleSubmit}
              initialImage={coverImage}
              loading={loading}
              error={error}
              submitLabel="Guardar Cambios"
              onCancel={() => navigate(`/posts/${id}`)}
              canPublish={canPublish}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditPost;

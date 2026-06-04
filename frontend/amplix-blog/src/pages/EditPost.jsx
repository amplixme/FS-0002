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
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Cargar el Post y las Categorías al mismo tiempo
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ejecutamos ambas peticiones en paralelo para que sea más rápido
        const [postResult, categoriesResult] = await Promise.all([
          getPostById(id),
          getAll(),
        ]);

        const post = postResult.data ? postResult.data : postResult;

        if (user.id !== post.authorId) {
          navigate("/");
          return;
        }

        // Llenar datos del post
        setTitle(post.title);
        setContent(post.content);
        setPublished(post.published);
        if (post.coverImage) setImagePreview(post.coverImage); // Ajustado a coverImage por si acaso

        // Llenar categorías disponibles
        setAvailableCategories(categoriesResult.data ?? []);

        // Pre-seleccionar las categorías que ya tiene el post
        if (post.categories && post.categories.length > 0) {
          // Asumiendo que post.categories es un array de objetos con { id, name... }
          setSelectedCategories(post.categories.map((cat) => cat.id));
        }
      } catch (error) {
        setError(error.message || "Error al cargar los datos del artículo");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, user.id, navigate]);

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("published", published);
      // Agregamos las categorías editadas
      formData.append("categories", JSON.stringify(selectedCategories));

      if (image) formData.append("image", image);

      await updatePost(id, formData);
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
                Modificá el contenido de tu artículo.
              </p>
            </header>

            <PostForm
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              published={published}
              setPublished={setPublished}
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
              // Props de categorías
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              submitLabel="Guardar Cambios"
              onCancel={() => navigate(`/posts/${id}`)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditPost;

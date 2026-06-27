import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { createPost } from "../services/post.service";
import { getAll } from "../services/category.service";
import PostForm from "../components/common/PostForm.jsx";
import { sileo } from "sileo";

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [coverImage, setCoverImage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Solo ADMIN y COLLABORATOR pueden publicar directamente
  const canPublish = user?.role === "ADMIN" || user?.role === "COLLABORATOR";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAll();
        setAvailableCategories(res.data ?? []);
      } catch (err) {
        // silencioso
      }
    };
    fetchCategories();
  }, []);

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
      await createPost({
        title,
        content,
        // Si el usuario no puede publicar, el backend igualmente fuerza false
        published: String(canPublish ? published : false),
        ...(coverImage && { coverImage }),
        categories: selectedCategories,
      });
      sileo.success({
        title: "Artículo creado correctamente",
        duration: 3000,
      });
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al crear el artículo");
      sileo.error({
        title: "Error al crear el artículo",
        description: err.message || "Intentá de nuevo más tarde.",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <main className="max-w-3xl mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl ambient-shadow overflow-hidden">
          {/* Barra superior */}
          <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary-container"></div>

          <div className="p-8 sm:p-10">
            <header className="mb-8 border-b border-outline-variant/30 pb-6">
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
                Crear Nuevo Artículo
              </h1>
              <p className="text-on-surface-variant mt-2">
                {canPublish
                  ? "Escribe y comparte tus ideas con la comunidad."
                  : "Escribe tu artículo. Quedará en borrador hasta ser publicado."}
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
              loading={loading}
              error={error}
              submitLabel="Guardar Artículo"
              onCancel={() => navigate("/")}
              canPublish={canPublish}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
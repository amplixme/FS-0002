import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/post.service";
import PostForm from "../components/common/PostForm.jsx";

export default function CreatePost() {
  const navigate = useNavigate();

  // Estados del formulario
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  // Estados de la petición
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e) {
    // ← agregás acá
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("published", published);
      if (image) {
        formData.append("image", image);
      }

      // Llamamos a la función del servicio de Ángel
      await createPost(formData);

      // La tarjeta pide redirigir al detalle, pero como la Card 26 (Detalle)
      // todavía no la hicimos, lo mandamos al inicio por ahora.
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al crear el artículo");
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
                Escribe y comparte tus ideas con la comunidad.
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
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              submitLabel="Guardar Artículo"
              onCancel={() => navigate("/")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

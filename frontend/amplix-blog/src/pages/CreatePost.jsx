import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, uploadImage } from "../services/post.service";
import { getAll } from "../services/category.service";
import PostForm from "../components/common/PostForm.jsx";

export default function CreatePost() {
  const navigate = useNavigate();

  // Estados del formulario
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  // Estados para Categorías
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Estados de la petición
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener categorías al cargar la página
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAll();
        setAvailableCategories(res.data ?? []);
      } catch (err) {
        console.error("Error al cargar categorías", err);
      }
    };
    fetchCategories();
  }, []);

  // Función para seleccionar/deseleccionar categorías
  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  };

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
      let coverImage = null;
      if (image){
        coverImage = await uploadImage(image);
      }      
        

      // Llamamos a la función del servicio de Ángel
      await createPost({
        title,
        content,
        published : String(published),
        coverImage,
        categories:  JSON.stringify(selectedCategories),
      });

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
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/post.service";

export default function CreatePost() {
  const navigate = useNavigate();

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  // Estados de la petición
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Llamamos a la función del servicio de Ángel
      const newPost = await createPost({ title, content, published });

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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-on-surface"
                >
                  Título del artículo
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  minLength={3}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Introducción a React Hooks..."
                  className="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-medium"
                />
              </div>

              {/* Contenido */}
              <div className="space-y-2">
                <label
                  htmlFor="content"
                  className="block text-sm font-bold text-on-surface"
                >
                  Contenido
                </label>
                <textarea
                  id="content"
                  required
                  minLength={10}
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe el contenido de tu artículo aquí..."
                  className="block w-full px-4 py-3 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-y"
                ></textarea>
              </div>

              {/* Toggle Publicar/Borrador */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={published}
                  onClick={() => setPublished(!published)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${
                    published ? "bg-primary" : "bg-outline-variant"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      published ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-on-surface">
                  {published
                    ? "Publicar inmediatamente"
                    : "Guardar como borrador"}
                </span>
              </div>

              {/* Mensaje de Error */}
              {error && (
                <div className="p-4 bg-error/10 text-error rounded-xl text-sm font-medium border border-error/20">
                  {error}
                </div>
              )}

              {/* Botones de acción */}
              <div className="pt-6 flex gap-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-6 py-3 rounded-full font-bold text-on-surface bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-full font-bold text-on-primary bg-primary hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">
                        progress_activity
                      </span>
                      Guardando...
                    </>
                  ) : (
                    "Guardar Artículo"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

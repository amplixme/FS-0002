import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import Pagination from "../components/common/Pagination";
import { CategorySidebar, CategoryChips } from "../components/CategoryFilter";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { EmptyState } from "../components/common/EmptyState";
import { getPosts } from "../services/post.service";
import { getAll as getCategories } from "../services/category.service";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // 1. Leer valores desde la URL (fuente de la verdad)
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentCategory = searchParams.get("category") || "";

  // Carga las categorías una sola vez al montar
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  // Recarga posts cuando cambia la página o la categoría en la URL
  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      setStatus("loading");
      try {
        // Llamamos al servicio con el nuevo formato
        const result = await getPosts({
          page: currentPage,
          limit: 6,
          category: currentCategory,
        });

        if (cancelled) return;

        // Extraemos data y totalPages de la respuesta de tu backend
        const postsData = result.data || result.posts || [];

        if (!postsData.length) {
          setStatus("empty");
        } else {
          setPosts(postsData);
          setTotalPages(result.totalPages || 1);
          setStatus("success");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    fetchPosts();
    return () => {
      cancelled = true;
    };
  }, [currentPage, currentCategory]);

  // Manejador de categorías sincronizado con la URL
  function handleCategorySelect(slug) {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category"); // null = "Todas" limpia el filtro
    }
    params.set("page", 1); // Al cambiar categoría, volvemos a la primera página
    setSearchParams(params);
  }

  // Manejador de paginación sincronizado con la URL
  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleRetry() {
    setStatus("loading");
    try {
      const result = await getPosts({
        page: currentPage,
        limit: 6,
        category: currentCategory,
      });
      const postsData = result.data || result.posts || [];
      if (!postsData.length) setStatus("empty");
      else {
        setPosts(postsData);
        setTotalPages(result.totalPages || 1);
        setStatus("success");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {/* Encabezado + buscador */}
        <div className="py-8 border-b border-slate-100 mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">
            Últimas publicaciones
          </h1>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar artículos..."
              className="w-full max-w-md pl-10 pr-4 py-2.5 bg-surface-container-low rounded-full text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar de categorías — solo desktop */}
          <CategorySidebar
            categories={categories}
            activeCategory={currentCategory}
            onSelect={handleCategorySelect}
          />

          <div className="flex-1 min-w-0">
            {/* Chips de categorías — solo mobile */}
            <CategoryChips
              categories={categories}
              activeCategory={currentCategory}
              onSelect={handleCategorySelect}
            />

            {/* Estados de la lista de posts */}
            {status === "loading" && <SkeletonLoader />}
            {status === "error" && <ErrorMessage onRetry={handleRetry} />}
            {status === "empty" && (
              <EmptyState message="No hay publicaciones todavía" />
            )}

            {status === "success" && posts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      ...post,
                      author: post.author?.name ?? "",
                      date: new Date(post.createdAt).toLocaleDateString(
                        "es-AR",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      ),
                      excerpt: post.content,
                    }}
                    onClick={() => navigate(`/posts/${post.id}`)}
                    onCategoryClick={handleCategorySelect}
                  />
                ))}
              </div>
            )}

            {/* Componente de Paginación */}
            {status === "success" && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

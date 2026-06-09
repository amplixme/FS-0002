import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentCategory = searchParams.get("category") || "";

  // Carga las categorías una sola vez al montar
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  // Recarga posts cuando cambia la página o la categoría activa
  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      setStatus("loading");
      try {
        const { data } = await getPosts(currentPage, activeCategory);
        if (cancelled) return;
        if (!data?.posts?.length) {
          setStatus("empty");
        } else {
          setPosts(data.posts);
          setTotalPages(data.totalPages);
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
  }, [currentPage, activeCategory]);

  function handleCategorySelect(slug) {
    setActiveCategory(slug); // null = "Todas" → limpia el filtro
    setCurrentPage(1);
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleRetry() {
    setStatus("loading");
    try {
      const { data } = await getPosts(currentPage, activeCategory);
      if (!data?.posts?.length) setStatus("empty");
      else {
        setPosts(data.posts);
        setTotalPages(data.totalPages);
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
            activeCategory={activeCategory}
            onSelect={handleCategorySelect}
          />

          <div className="flex-1 min-w-0">
            {/* Chips de categorías — solo mobile */}
            <CategoryChips
              categories={categories}
              activeCategory={activeCategory}
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

            {/* Paginación */}
            {status === "success" && totalPages > 1 && (
              <nav className="flex justify-between items-center py-12 border-t border-slate-100 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 text-slate-400 font-semibold text-sm active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">
                    arrow_back
                  </span>
                  Anterior
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        currentPage === i + 1 ? "bg-primary" : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 text-primary font-bold text-sm active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </nav>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

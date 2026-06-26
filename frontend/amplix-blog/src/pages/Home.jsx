import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import Pagination from "../components/common/Pagination";
import { CategorySidebar, CategoryChips } from "../components/CategoryFilter";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { EmptyState } from "../components/common/EmptyState";
import { getPosts } from "../services/post.service";
import { getAll as getCategories } from "../services/category.service";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(currentSearch);
  const isFirstRender = useRef(true);

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (searchInput.trim()) {
          params.set("search", searchInput.trim());
        } else {
          params.delete("search");
        }
        params.set("page", "1");
        return params;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  async function loadPostsData(checkIfCancelled = () => false) {
    setStatus("loading");
    try {
      const result = await getPosts({
        page: currentPage,
        limit: 6,
        category: currentCategory,
        sort: currentSort,
        search: currentSearch,
      });

      if (checkIfCancelled()) return;

      const postsData = result.data?.data || result.data || [];

      if (!postsData.length) {
        setStatus("empty");
      } else {
        setPosts(postsData);
        setTotalPages(result.data?.totalPages || result.totalPages || 1);
        setStatus("success");
      }
    } catch {
      if (!checkIfCancelled()) setStatus("error");
    }
  }

  useEffect(() => {
    let cancelled = false;
    loadPostsData(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [currentPage, currentCategory, currentSort, currentSearch]);

  function handleCategorySelect(slug) {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.set("page", 1);
    setSearchParams(params);
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSortChange(e) {
    const params = new URLSearchParams(searchParams);
    params.set("sort", e.target.value);
    params.set("page", 1);
    setSearchParams(params);
  }

  async function handleRetry() {
    await loadPostsData();
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <main className="max-w-7xl mx-auto px-4 pb-12">
        {/* Header de página */}
        <div className="py-8 border-b border-slate-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight">Últimas publicaciones</h1>
          {isAuthenticated && (
            <Link
              to="/create-post"
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-bold hover:opacity-90 hover:scale-110 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nuevo artículo
            </Link>
          )}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-surface-container-low rounded-full text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Limpiar búsqueda"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Ordenamiento */}
            <div className="relative">
              <select
                value={currentSort}
                onChange={handleSortChange}
                aria-label="Ordenar publicaciones"
                className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low rounded-full text-sm font-medium text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer border border-transparent hover:border-outline-variant transition-colors"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Layout principal: sidebar + grid */}
        <div className="flex gap-8">
          <CategorySidebar
            categories={categories}
            activeCategory={currentCategory}
            onSelect={handleCategorySelect}
          />

          <div className="flex-1 min-w-0">
            <CategoryChips
              categories={categories}
              activeCategory={currentCategory}
              onSelect={handleCategorySelect}
            />

            {status === "loading" && <SkeletonLoader />}
            {status === "error" && <ErrorMessage onRetry={handleRetry} />}
            {status === "empty" && <EmptyState message="No hay publicaciones todavía" />}

            {status === "success" && posts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={{
                      ...post,
                      author: post.author?.name ?? "",
                      authorAvatar: post.author?.avatarUrl ?? null,
                      date: new Date(post.createdAt).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }),
                      excerpt: post.content,
                    }}
                    onClick={() => navigate(`/posts/${post.id}`)}
                    onCategoryClick={handleCategorySelect}
                  />
                ))}
              </div>
            )}

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

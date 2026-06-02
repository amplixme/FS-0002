import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/post.service";

const CATEGORIES = ["Featured", "Latest", "Tecnología", "Diseño", "Cultura"];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeCategory, setActiveCategory] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
 
  useEffect(() => {
    let cancelled = false;

    async function fetchPosts() {
      setStatus("loading");
      try {
        console.log("Fetching page:", currentPage);
        const { data } = await getPosts(currentPage);
        if (cancelled) return;
        if (!data?.posts || data.posts.length === 0) {
          setStatus("empty");
        } else {
          setPosts(data.posts);
          setTotalPages(data.totalPages);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) setStatus("error");
      }
    }

    fetchPosts();
    return () => { cancelled = true; };
  }, [currentPage]); // ← se vuelve a ejecutar cada vez que cambia la página

  function handleCardClick(id) {
    navigate(`/posts/${id}`);
  }

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleRetry() {
    setStatus("loading");
    try {
      const { data } = await getPosts(currentPage);
      if (!data?.posts || data.posts.length === 0) {
        setStatus("empty");
      } else {
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

      {/* Header de la página */}
      <div className="py-8 border-b border-slate-100 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight mb-4">Últimas publicaciones</h1>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input
            type="text"
            placeholder="Buscar artículos..."
            className="w-full max-w-md pl-10 pr-4 py-2.5 bg-surface-container-low rounded-full text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex gap-8">

        {/* Sidebar izquierdo */}
        <aside className="hidden lg:block w-48 flex-shrink-0">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Categorías</h2>
          <ul className="space-y-1">
            {[
              { name: "Design", count: 24, icon: "design_services" },
              { name: "Engineering", count: 18, icon: "code" },
              { name: "Product", count: 12, icon: "inventory_2" },
              { name: "Culture", count: 9, icon: "groups" },
              { name: "News", count: 31, icon: "newspaper" },
            ].map((cat) => (
              <li key={cat.name}>
                <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-container transition-colors group">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-primary transition-colors">{cat.icon}</span>
                    <span className="text-sm font-medium text-on-surface">{cat.name}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{cat.count}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px] text-slate-400">help</span>
              <span className="text-sm font-medium text-on-surface">Help</span>
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[18px] text-slate-400">settings</span>
              <span className="text-sm font-medium text-on-surface">Settings</span>
            </button>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">

          {/* Category Chips — solo mobile */}
          <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-2 pb-4 mb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-[#024ce2] text-white"
                    : "bg-surface-container-lowest text-slate-600 hover:bg-slate-100 font-medium"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Estado: Cargando */}
          {status === "loading" && <SkeletonList />}

          {/* Estado: Error */}
          {status === "error" && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="material-symbols-outlined text-5xl text-error">error_outline</span>
              <p className="text-slate-600 text-center text-sm">
                No se pudieron cargar las publicaciones.
                <br />
                Verificá tu conexión e intentá de nuevo.
              </p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 rounded-full bg-[#024ce2] text-white text-sm font-semibold active:scale-95 transition-transform"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Estado: Vacío */}
          {status === "empty" && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="material-symbols-outlined text-5xl text-outline">article</span>
              <p className="text-slate-500 text-sm font-medium">No hay publicaciones todavía</p>
            </div>
          )}

          {/* Estado: Success */}
          {status === "success" && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    ...post,
                    author: post.author?.name ?? "",
                    date: new Date(post.createdAt).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }),
                    excerpt: post.content,
                  }}
                  onClick={handleCardClick}
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
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Anterior
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentPage === i + 1 ? "bg-[#024ce2]" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 text-[#024ce2] font-bold text-sm active:scale-95 transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Siguiente
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </nav>
          )}

        </div>
      </div>
    </main>
  </div>
);
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[16/9] bg-surface-container rounded-xl mb-5" />
      <div className="h-3 bg-surface-container rounded w-24 mb-3" />
      <div className="h-6 bg-surface-container rounded w-3/4 mb-2" />
      <div className="h-4 bg-surface-container rounded w-full mb-1" />
      <div className="h-4 bg-surface-container rounded w-5/6 mb-4" />
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-surface-container rounded-full" />
        <div className="h-3 bg-surface-container rounded w-28" />
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-12 mt-4">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
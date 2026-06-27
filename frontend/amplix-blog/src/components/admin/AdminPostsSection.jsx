// frontend/amplix-blog/src/components/admin/AdminPostsSection.jsx

import { useNavigate } from "react-router-dom";
import CardSkeleton from "./CardSkeleton";
import PostCard from "./PostCard";

export default function AdminPostsSection({
  posts,
  loading,
  showAll,
  onToggleShowAll,
  onDelete,
  onPublish,
  formatDate,
}) {
  const navigate = useNavigate();
  const visible = showAll ? posts : posts.slice(0, 2);

  return (
    <section className="bg-surface-container-lowest rounded-2xl ambient-shadow p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-on-surface">Post Recientes</h2>
        {!loading && posts.length > 2 && (
          <button
            onClick={onToggleShowAll}
            className="hidden cursor-pointer sm:block text-sm text-primary font-semibold hover:underline"
          >
            {showAll ? "Ver menos" : "Ver todos"}
          </button>
        )}
      </div>

      {loading ? (
        <CardSkeleton rows={2} />
      ) : posts.length === 0 ? (
        <p className="text-sm text-on-surface-variant text-center py-8">No hay publicaciones</p>
      ) : (
        <>
          {/* ── Mobile ── */}
          <div className="sm:hidden space-y-3">
            {visible.map((p) => (
              <PostCard key={p.id} p={p} onDelete={() => onDelete(p)} formatDate={formatDate} />
            ))}
            {posts.length > 2 && (
              <button
                onClick={onToggleShowAll}
                className="w-full text-sm cursor-pointer text-primary font-semibold py-2 hover:underline"
              >
                {showAll ? "Ver menos" : `Ver todos los posts (${posts.length})`}
              </button>
            )}
          </div>

          {/* ── Desktop ── */}
          <div className="hidden sm:block">
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="border-b border-outline-variant">

                  {/* Título — siempre visible, ocupa el espacio restante */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 w-auto">
                    Título
                  </th>

                  {/* Autor — visible desde sm */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 w-24">
                    Autor
                  </th>

                  {/* Categorías — solo desde xl */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 w-28 hidden xl:table-cell">
                    Categorías
                  </th>

                  {/* Fecha — solo desde xl */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 w-24 hidden xl:table-cell">
                    Fecha
                  </th>

                  {/* Estado — visible desde sm */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 pr-3 w-28">
                    Estado
                  </th>

                  {/* Acciones — siempre visible, ancho fijo */}
                  <th className="text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide pb-3 w-24">
                    Acciones
                  </th>

                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {visible.map((p) => (
                  <tr key={p.id}>

                    {/* Título + imagen */}
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        {p.coverImage ? (
                          <img
                            src={p.coverImage}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-on-surface-variant text-[14px]">
                              image
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-on-surface truncate">
                          {p.title}
                        </span>
                      </div>
                    </td>

                    {/* Autor */}
                    <td className="py-3 pr-3 text-on-surface-variant text-xs truncate">
                      {p.author?.name}
                    </td>

                    {/* Categorías — solo xl */}
                    <td className="py-3 pr-3 hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.categories?.slice(0, 1).map((c) => (
                          <span
                            key={c.id}
                            className="text-xs bg-secondary-container/30 text-secondary px-2 py-0.5 rounded-full font-semibold uppercase truncate max-w-[80px]"
                          >
                            {c.name}
                          </span>
                        ))}
                        {p.categories?.length > 1 && (
                          <span className="text-xs text-on-surface-variant">
                            +{p.categories.length - 1}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Fecha — solo xl */}
                    <td className="py-3 pr-3 text-on-surface-variant text-xs whitespace-nowrap hidden xl:table-cell">
                      {formatDate(p.createdAt)}
                    </td>

                    {/* Estado */}
                    <td className="py-3 pr-3">
                      {p.published ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-surface-container-highest text-on-surface-variant whitespace-nowrap">
                          <span className="material-symbols-outlined text-[12px]">draft</span>
                          Borrador
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3">
                      <div className="flex items-center gap-0.5">

                        {/* Ver */}
                        <button
                          onClick={() => navigate(`/posts/${p.id}`)}
                          className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-surface-container transition text-on-surface-variant"
                          title="Ver post"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>

                        {/* Publicar — solo borradores */}
                        {!p.published && (
                          <button
                            onClick={() => onPublish(p)}
                            className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-primary/10 transition text-primary"
                            title="Publicar borrador"
                          >
                            <span className="material-symbols-outlined text-[18px]">publish</span>
                          </button>
                        )}

                        {/* Eliminar */}
                        <button
                          onClick={() => onDelete(p)}
                          className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-full hover:bg-error/10 transition text-error"
                          title="Eliminar post"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
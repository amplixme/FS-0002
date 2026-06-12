// PostCard.jsx
// Sigue el design system del wireframe: Inter, colores custom Tailwind, cards con imagen 16/9
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../utils/dateFormatter";


export default function PostCard({ post, onClick, onCategoryClick }) {
  const {
    id,
    title,
    excerpt,
    author,
    authorId,
    authorAvatar,
    createdAt,
    categories = [],
    coverImage,
    readTime,
    commentCount = 0,
  } = post;

  // Trunca el extracto a ~150 chars
  const truncatedExcerpt =
    excerpt && excerpt.length > 150 ? excerpt.slice(0, 150) + "…" : excerpt;
  const visibleCategories = categories.slice(0, 3);
  const extraCategoriesCount = categories.length - 3;

  return (
    <article
      className="group cursor-pointer flex flex-col h-full"
      onClick={() => onClick && onClick(id)}
    >
      {/* Imagen */}
      <div className="w-full aspect-[16/9] bg-surface-container-low rounded-xl overflow-hidden mb-5 relative">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <span className="material-symbols-outlined text-4xl text-outline">
              article
            </span>
          </div>
        )}
      </div>

      {/* Meta: Categorías (Badges) + tiempo de lectura */}
      <div className="flex items-center flex-wrap gap-2 mb-4">
        {/* Mapeamos solo las primeras 3 categorías */}
        {visibleCategories.map((cat) => (
          <button
            key={cat.id || cat.slug}
            onClick={(e) => {
              e.stopPropagation();
              if (onCategoryClick) onCategoryClick(cat.slug);
            }}
            className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-secondary-container/30 text-on-secondary-container hover:bg-primary hover:text-white transition-colors"
          >
            {cat.name}
          </button>
        ))}

        {/* Si hay más de 3, mostramos el contador extra */}
        {extraCategoriesCount > 0 && (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-surface-container-high text-on-surface-variant">
            +{extraCategoriesCount}
          </span>
        )}

        {/* Tiempo de lectura (alineado a la derecha si hay espacio) */}
        {readTime && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
              {readTime} min lectura
            </span>
          </div>
        )}
      </div>

      {/* Título */}
      <h3 className="text-2xl font-bold leading-tight tracking-tight mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>

      {/* Extracto */}
      {truncatedExcerpt && (
        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
          {truncatedExcerpt}
        </p>
      )}

      {/* Autor */}
    <div className="flex items-center justify-between mt-auto">
  <div className="flex items-center gap-3">
    {authorAvatar ? (
      <img src={authorAvatar} alt={author} className="w-8 h-8 rounded-full object-cover" />
    ) : (
      <div className="w-8 h-8 bg-surface-container-highest rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined text-[16px]">person</span>
      </div>
    )}
    <div className="flex flex-col">
      {authorId ? (
        <Link to={`/perfil/${authorId}`} onClick={(e) => e.stopPropagation()} className="text-sm text-on-surface font-semibold leading-tight hover:text-primary transition-colors">
          {author}
        </Link>
      ) : (
        <span className="text-sm text-on-surface font-semibold leading-tight">{author}</span>
      )}
      {createdAt && (
        <span className="text-[11px] font-medium text-slate-500 mt-0.5">
          {formatRelativeTime(createdAt)}
        </span>
      )}
    </div>
  </div>

  <div className="flex items-center gap-1 text-slate-400">
    <span className="material-symbols-outlined text-[16px]">chat</span>
    <span className="text-xs font-medium">{commentCount}</span>
  </div>
</div>
    </article>
  );
}

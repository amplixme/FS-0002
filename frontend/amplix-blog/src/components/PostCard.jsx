import { Link } from "react-router-dom";
import { formatRelativeTime } from "../utils/dateFormatter";
import Avatar from "./common/Avatar";


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

  const truncatedExcerpt = excerpt && excerpt.length > 150 ? excerpt.slice(0, 150) + "…" : excerpt;
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
            <span className="material-symbols-outlined text-4xl text-outline">article</span>
          </div>
        )}
      </div>

      {/* Meta: Categorías + tiempo de lectura */}
      <div className="flex items-center flex-wrap gap-2 mb-4">
        {visibleCategories.map((cat) => (
          <button
            key={cat.id || cat.slug}
            onClick={(e) => {
              e.stopPropagation();
              if (onCategoryClick) onCategoryClick(cat.slug);
            }}
            className="px-2.5 py-1 cursor-pointer text-[10px] font-bold uppercase tracking-widest rounded-md bg-secondary-container/30 text-on-secondary-container hover:bg-primary hover:text-on-primary transition-colors"
          >
            {cat.name}
          </button>
        ))}

        {extraCategoriesCount > 0 && (
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-surface-container-high text-on-surface-variant">
            +{extraCategoriesCount}
          </span>
        )}

        {readTime && (
          <div className="flex items-center gap-2 ml-auto">
            {/* slate-300 → outline-variant */}
            <span className="w-1 h-1 bg-outline-variant rounded-full" />
            {/* slate-500 → outline */}
            <span className="text-[10px] font-medium text-outline uppercase tracking-widest">
              {readTime} min lectura
            </span>
          </div>
        )}
      </div>

      {/* Título */}
      <h2 className="text-2xl font-bold leading-tight tracking-tight mb-3 group-hover:text-primary transition-colors text-on-surface">
        {title}
      </h2>

      {/* Extracto — slate-600 → on-surface-variant */}
      {truncatedExcerpt && (
        <p className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-grow">
          {truncatedExcerpt}
        </p>
      )}

      {/* Autor */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">

          {/* ✅ Avatar reutilizable — foto o inicial */}
          <Avatar src={authorAvatar} name={author} size="md" />

          <div className="flex flex-col min-w-0">
            {authorId ? (
              <Link
                to={`/perfil/${authorId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-on-surface font-semibold leading-tight hover:text-primary transition-colors truncate"
              >
                {author}
              </Link>
            ) : (
              <span className="text-sm text-on-surface font-semibold leading-tight truncate">
                {author}
              </span>
            )}
            {createdAt && (
              <span className="text-[11px] font-medium text-outline mt-0.5">
                {formatRelativeTime(createdAt)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-outline flex-shrink-0">
          <span className="material-symbols-outlined text-[16px]">chat</span>
          <span className="text-xs font-medium">{commentCount}</span>
        </div>
      </div>
    </article>
  );
}

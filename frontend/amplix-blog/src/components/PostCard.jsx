// PostCard.jsx
// Sigue el design system del wireframe: Inter, colores custom Tailwind, cards con imagen 16/9

export default function PostCard({ post, onClick }) {
  const { id, title, excerpt, author, authorAvatar, date, category, categoryColor, coverImage, readTime } = post;

  // Trunca el extracto a ~150 chars
  const truncatedExcerpt =
    excerpt && excerpt.length > 150 ? excerpt.slice(0, 150) + "…" : excerpt;

  const categoryStyles = {
    Tecnología: "text-[#024ce2]",
    Diseño: "text-[#006877]",
    Cultura: "text-[#9e3d00]",
    Default: "text-[#024ce2]",
  };

  const categoryColor_ = categoryStyles[category] || categoryStyles["Default"];

  return (
    <article
      className="group cursor-pointer"
      onClick={() => onClick && onClick(id)}
    >
      {/* Imagen */}
      <div className="w-full aspect-[16/9] bg-surface-container-low rounded-xl overflow-hidden mb-5">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-outline">article</span>
          </div>
        )}
      </div>

      {/* Meta: categoría + tiempo de lectura */}
      <div className="flex items-center gap-2 mb-3">
        {category && (
          <span className={`text-[10px] font-bold uppercase tracking-widest ${categoryColor_}`}>
            {category}
          </span>
        )}
        {readTime && (
          <>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
              {readTime} min lectura
            </span>
          </>
        )}
      </div>

      {/* Título */}
      <h3 className="text-2xl font-bold leading-tight tracking-tight mb-3">
        {title}
      </h3>

      {/* Extracto */}
      {truncatedExcerpt && (
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {truncatedExcerpt}
        </p>
      )}

      {/* Autor */}
      <div className="flex items-center gap-3">
        {authorAvatar ? (
          <img
            src={authorAvatar}
            alt={author}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 bg-surface-container-highest rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-xs">person</span>
          </div>
        )}
        <div className="text-[0.75rem] font-medium">
          <span className="text-on-surface font-semibold">{author}</span>
          {date && (
            <>
              <span className="text-slate-400 mx-1">•</span>
              <span className="text-slate-400">{date}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
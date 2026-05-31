// CategoryFilter.jsx
// Sidebar desktop con ícono + badge de cantidad · Chips mobile (solo nombre)

// ─── Mapeo slug → ícono Material Symbols ───────────────────────────────────
const SLUG_TO_ICON = {
  // diseño / design
  design: "palette",
  diseno: "palette",
  // ingeniería / engineering
  engineering: "code",
  ingenieria: "code",
  "ciencia-tecnologia": "code",
  tecnologia: "computer",
  // producto / product
  product: "grid_view",
  producto: "grid_view",
  // cultura / culture
  culture: "groups",
  cultura: "groups",
  // noticias / news
  news: "newspaper",
  noticias: "newspaper",
  // otros comunes
  devops: "terminal",
  opinion: "forum",
  ciencia: "science",
  ficcion: "menu_book",
  "no-ficcion": "auto_stories",
};

function getIcon(slug) {
  return SLUG_TO_ICON[slug?.toLowerCase()] ?? "label";
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const TODAS = { id: "todas", name: "Todas", slug: null };

function buildList(categories) {
  return [TODAS, ...categories];
}

function isActive(activeCategory, slug) {
  return activeCategory === slug;
}

// ─── Desktop: sidebar lateral ───────────────────────────────────────────────
export function CategorySidebar({ categories, activeCategory, onSelect }) {
  const list = buildList(categories);

  return (
    <aside className="hidden lg:block w-52 flex-shrink-0">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
        Categorías
      </h2>
      <ul className="space-y-0.5">
        {list.map((cat) => {
          const active = isActive(activeCategory, cat.slug);
          const count = cat._count?.posts;

          return (
            <li key={cat.id}>
              <button
                onClick={() => onSelect(cat.slug)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                {/* Ícono — solo para categorías reales (no "Todas") */}
                {cat.slug ? (
                  <span className="material-symbols-outlined text-[18px] flex-shrink-0">
                    {getIcon(cat.slug)}
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[18px] flex-shrink-0">
                    apps
                  </span>
                )}

                {/* Nombre */}
                <span className="flex-1 text-left">{cat.name}</span>

                {/* Badge de cantidad — solo si viene del backend */}
                {count != null && (
                  <span
                    className={`text-[11px] font-semibold min-w-[20px] text-center px-1.5 py-0.5 rounded-full ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

// ─── Mobile: chips horizontales scrolleables ─────────────────────────────────
export function CategoryChips({ categories, activeCategory, onSelect }) {
  const list = buildList(categories);

  return (
    <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-2 pb-3 mb-4">
      {list.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            isActive(activeCategory, cat.slug)
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface hover:bg-surface-container-high"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
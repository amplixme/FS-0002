

const SLUG_TO_ICON = {
  design: "palette",
  diseno: "palette",
  engineering: "code",
  ingenieria: "code",
  "ciencia-tecnologia": "code",
  tecnologia: "computer",
  product: "grid_view",
  producto: "grid_view",
  culture: "groups",
  cultura: "groups",
  news: "newspaper",
  noticias: "newspaper",
  devops: "terminal",
  opinion: "forum",
  ciencia: "science",
  ficcion: "menu_book",
  "no-ficcion": "auto_stories",
};

function getIcon(slug) {
  return SLUG_TO_ICON[slug?.toLowerCase()] ?? "label";
}

const TODAS = { id: "todas", name: "Todas", slug: null };

function buildList(categories) {
  return [TODAS, ...categories];
}

function isActive(activeCategory, slug) {
  return activeCategory === slug;
}


function SidebarFooterButtons() {
  return (
    <div className="mt-8 space-y-1">
      <button className="w-full cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-container transition-colors">
        <span className="material-symbols-outlined text-[18px] text-slate-400">help</span>
        <span className="text-sm font-medium text-on-surface">Help</span>
      </button>
      <button className="w-full flex items-center cursor-pointer gap-2 px-3 py-2 rounded-lg hover:bg-surface-container transition-colors">
        <span className="material-symbols-outlined text-[18px] text-slate-400">settings</span>
        <span className="text-sm font-medium text-on-surface">Settings</span>
      </button>
    </div>
  );
}


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
                className={`w-full cursor-pointer flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                {cat.slug ? (
                  <span className="material-symbols-outlined text-[18px] flex-shrink-0">
                    {getIcon(cat.slug)}
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[18px] flex-shrink-0">apps</span>
                )}

                <span className="flex-1 text-left">{cat.name}</span>

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

      {/* ── Botones Help y Settings al fondo ── */}
      <SidebarFooterButtons />
    </aside>
  );
}


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

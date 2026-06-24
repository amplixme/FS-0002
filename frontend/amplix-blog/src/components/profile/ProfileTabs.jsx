/**
 * Tabs del perfil de usuario.
 *
 * Props:
 *   activeTab      — tab activa ("publicaciones" | "borradores" | "comentarios")
 *   onTabChange    — función llamada al cambiar de tab
 *   showDraftsTab  — true solo cuando el usuario está viendo su propio perfil
 *   draftsCount    — cantidad de borradores (para mostrar badge en la tab)
 */
export default function ProfileTabs({
  activeTab,
  onTabChange,
  showDraftsTab = false,
  draftsCount = 0,
}) {
  const tabs = [
    { key: "publicaciones", label: "Publicaciones" },
    ...(showDraftsTab
      ? [
          {
            key: "borradores",
            label: "Mis Borradores",
            count: draftsCount,
          },
        ]
      : []),
    { key: "comentarios", label: "Comentarios" },
  ];

  return (
    <div className="border-b border-outline-variant/40 mb-8">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-on-surface hover:border-outline-variant"
            }`}
          >
            {tab.label}
            {/* Badge con cantidad de borradores */}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                  activeTab === tab.key
                    ? "bg-primary text-white"
                    : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

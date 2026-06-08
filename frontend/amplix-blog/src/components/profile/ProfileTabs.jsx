const TABS = [
  { key: "publicaciones", label: "Publicaciones" },
  { key: "comentarios", label: "Comentarios" },
];

export default function ProfileTabs({ activeTab, onTabChange }) {
  return (
    <div className="border-b border-outline-variant/40 mb-8">
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-6 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-on-surface hover:border-outline-variant"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
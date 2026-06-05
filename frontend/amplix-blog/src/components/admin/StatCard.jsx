export default function StatCard({ icon, label, value, sub, subGreen = false, loading }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl ambient-shadow p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-on-surface-variant">{label}</p>
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[20px]">
            {icon}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-9 bg-surface-container rounded w-24 mb-2" />
          <div className="h-3 bg-surface-container rounded w-32" />
        </div>
      ) : (
        <>
          <p className="text-3xl font-extrabold text-on-surface mb-1">
            {value != null ? value.toLocaleString("es-AR") : "—"}
          </p>
          {sub && (
            <p
              className={`text-xs font-medium flex items-center gap-1 ${
                subGreen ? "text-green-600" : "text-on-surface-variant"
              }`}
            >
              {subGreen && (
                <span className="material-symbols-outlined text-[14px]">
                  check_circle
                </span>
              )}
              {sub}
            </p>
          )}
        </>
      )}
    </div>
  );
}
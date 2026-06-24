import { Link } from "react-router-dom";
import { formatRelativeTime } from "../../utils/dateFormatter";
import { EmptyState } from "../common/EmptyState";

/**
 * Grid de borradores del usuario propio.
 * Cada card muestra título, fecha, categorías y acciones directas
 * para no tener que navegar a /posts/:id para llegar al borrador.
 */
export default function UserDraftsGrid({ drafts, onDelete }) {
  if (drafts.length === 0) {
    return (
      <EmptyState message="No tenés borradores pendientes. ¡Creá un artículo para empezar!" />
    );
  }

  return (
    <div className="space-y-3">
      {drafts.map((draft) => (
        <article
          key={draft.id}
          className="bg-surface-container-lowest rounded-2xl overflow-hidden ambient-shadow"
        >
          {/* Barra superior */}
          <div className="h-1 w-full bg-gradient-to-r from-outline-variant to-surface-container" />

          <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/40">
                  Borrador
                </span>
                {draft.categories?.map((cat) => (
                  <span
                    key={cat.id}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>

              <h3 className="font-extrabold text-on-surface leading-snug truncate">
                {draft.title}
              </h3>

              <p className="text-xs text-outline mt-0.5">
                {formatRelativeTime(draft.createdAt)}
              </p>
            </div>

            {/* Acciones directas — el usuario va directo a donde necesita */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/posts/${draft.id}/edit`}
                className="inline-flex items-center gap-1 px-4 py-2 bg-primary hover:bg-on-primary-fixed-variant text-on-primary font-bold rounded-full text-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Editar
              </Link>

              <Link
                to={`/posts/${draft.id}`}
                className="inline-flex items-center gap-1 px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-bold rounded-full text-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Ver
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

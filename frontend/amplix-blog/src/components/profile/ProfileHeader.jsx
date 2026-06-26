// frontend/amplix-blog/src/components/profile/ProfileHeader.jsx

import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";

function formatMemberSince(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr)
    .toLocaleDateString("es-AR", { year: "numeric", month: "long" })
    .replace(" de ", " ");
}

export default function ProfileHeader({ profile, isOwnProfile }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl ambient-shadow p-8 mb-8">
      <div className="flex items-start gap-6">

        {/* ✅ Avatar con foto o inicial */}
        <div className="shrink-0">
          <Avatar src={profile.avatarUrl} name={profile.name} size="xl" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-on-surface leading-tight">
            {profile.name}
          </h1>

          {profile.bio && (
            <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-3 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-outline">article</span>
              {profile.postCount} publicaciones
            </span>
            <span className="text-outline-variant">·</span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-outline">calendar_month</span>
              Miembro desde {formatMemberSince(profile.createdAt)}
            </span>
          </div>

          {isOwnProfile && (
            <Link
              to="/perfil/editar"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 border border-primary text-primary text-sm font-semibold rounded-full hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Editar perfil
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
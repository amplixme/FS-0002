import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getProfile, getUserPosts, updateProfile, getMyDrafts } from "../services/user.service";
import ProfileSkeleton from "../components/profile/ProfileSkeleton";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import ProfileTabs from "../components/profile/ProfileTabs";
import UserPostsGrid from "../components/profile/UserPostsGrid";
import UserDraftsGrid from "../components/profile/UserDraftsGrid";
import { EmptyState } from "../components/common/EmptyState";
import Toast from "../components/common/Toast";

export default function UserProfile() {
  const { id } = useParams();
  const { user: authUser, updateUser } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("publicaciones");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const isOwnProfile = authUser?.id === parseInt(id);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Si es el propio perfil y está autenticado, cargamos también los borradores
        const requests = [getProfile(id), getUserPosts(id)];
        if (isOwnProfile) requests.push(getMyDrafts());

        const results = await Promise.all(requests);
        if (cancelled) return;

        setProfile(results[0].data ?? results[0]);
        setPosts(Array.isArray(results[1].data ?? results[1]) ? (results[1].data ?? results[1]) : []);
        if (isOwnProfile && results[2]) {
          setDrafts(Array.isArray(results[2].data ?? results[2]) ? (results[2].data ?? results[2]) : []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Error al cargar el perfil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [id, isOwnProfile]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const res = await updateProfile(formData);
      const updated = res.data ?? res;
      setProfile((prev) => ({ ...prev, ...updated }));
      if (isOwnProfile) updateUser(updated);
      setIsEditing(false);
      setToast({ message: "Perfil actualizado correctamente", type: "success" });
    } catch (err) {
      setToast({ message: err.message || "Error al guardar los cambios", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
        <main className="max-w-4xl mx-auto">
          <ProfileSkeleton />
          <div className="border-b border-outline-variant/40 mb-8 animate-pulse">
            <div className="flex gap-0">
              <div className="h-10 w-32 bg-surface-container rounded-t" />
              <div className="h-10 w-28 bg-surface-container rounded-t ml-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="w-full aspect-[16/9] bg-surface-container rounded-xl" />
                <div className="h-5 bg-surface-container rounded w-3/4" />
                <div className="h-4 bg-surface-container rounded w-full" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <span className="material-symbols-outlined text-5xl text-outline">person_off</span>
        <p className="text-error font-bold text-xl">{error || "Perfil no encontrado"}</p>
        <Link to="/" className="text-primary hover:underline font-medium">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
        <main className="max-w-4xl mx-auto">
          {isEditing ? (
            <div className="bg-surface-container-lowest rounded-2xl ambient-shadow p-8 mb-8">
              <ProfileEditForm
                profile={profile}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
                saving={saving}
              />
            </div>
          ) : (
            <ProfileHeader
              profile={profile}
              isOwnProfile={isOwnProfile}
              onEdit={() => setIsEditing(true)}
            />
          )}

          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showDraftsTab={isOwnProfile}
            draftsCount={drafts.length}
          />

          {activeTab === "publicaciones" && <UserPostsGrid posts={posts} />}

          {activeTab === "borradores" && isOwnProfile && (
            <UserDraftsGrid drafts={drafts} />
          )}

          {activeTab === "comentarios" && (
            <EmptyState message="Los comentarios del usuario estarán disponibles próximamente." />
          )}
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

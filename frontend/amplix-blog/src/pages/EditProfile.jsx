import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "../services/user.service";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import Toast from "../components/common/Toast";

export default function EditProfile() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  if (!user) return null;

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const res = await updateProfile(formData);
      const updated = res.data ?? res;
      updateUser(updated);
      setToast({ message: "Perfil actualizado correctamente", type: "success" });
      setTimeout(() => navigate(`/perfil/${user.id}`), 1200);
    } catch (err) {
      setToast({
        message: err.message || "Error al actualizar el perfil",
        type: "error",
      });
      setSaving(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
        <main className="max-w-xl mx-auto">
          {/* Encabezado de página */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-on-surface">Editar Perfil</h1>
            <p className="text-on-surface-variant mt-1 text-sm">
              Personaliza tu identidad digital en la plataforma.
            </p>
          </div>

          {/* Card del formulario */}
          <div className="bg-surface-container-lowest rounded-2xl ambient-shadow p-8">
            <ProfileEditForm
              profile={user}
              onSave={handleSave}
              onCancel={() => navigate(`/perfil/${user.id}`)}
              saving={saving}
            />
          </div>

          {/* Aviso de privacidad */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              gap: "12px",
              backgroundColor: "#e0f2fe",
              borderLeft: "4px solid #0284c7",
              borderRadius: "0 12px 12px 0",
              padding: "16px 20px",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "#0284c7", fontSize: "20px", marginTop: "2px", flexShrink: 0 }}
            >
              info
            </span>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#0369a1", margin: 0 }}>
                Privacidad del Perfil
              </p>
              <p
                style={{ fontSize: "14px", color: "#475569", marginTop: "4px", lineHeight: "1.5" }}
              >
                Tu nombre y biografía serán visibles para otros usuarios. No compartas información
                sensible como direcciones o contraseñas en tu biografía.
              </p>
            </div>
          </div>
        </main>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

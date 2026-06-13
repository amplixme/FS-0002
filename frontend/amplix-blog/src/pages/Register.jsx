import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import api from "../services/api.js";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 2)
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Ingresá un email válido";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login", {
        state: { success: "Cuenta creada exitosamente. Iniciá sesión." },
      });
    } catch (error) {
      setServerError(error.response?.data?.error?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link to="/" className="text-3xl font-bold text-gray-900 my-6">
        Amplix
      </Link>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Crear cuenta</h1>
        <p className="text-gray-500 text-sm text-center mb-6">Únete a la comunidad</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre completo</label>
            <div className="flex items-center border border-gray-200 rounded-lg focus-within:border-gray-400 px-4 py-3 gap-3">
              <FaUser className="text-gray-400" size={14} />
              <input
                type="text"
                name="name"
                placeholder="Ej. Juan Pérez"
                value={formData.name}
                onChange={handleChange}
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Correo electrónico
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg focus-within:border-gray-400 px-4 py-3 gap-3">
              <FaEnvelope className="text-gray-400" size={14} />
              <input
                type="email"
                name="email"
                placeholder="nombre@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña</label>
            <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 gap-3 focus-within:border-gray-400">
              <FaLock className="text-gray-400" size={14} />
              <input
                type="password"
                name="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Confirmar contraseña
            </label>
            <div className="flex items-center border border-gray-200 rounded-lg px-4 py-3 gap-3 focus-within:border-gray-400">
              <FaLock className="text-gray-400" size={14} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repetí tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="flex-1 text-sm outline-none bg-transparent"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Error servidor */}
          {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition mt-2 cursor-pointer"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>

      {/* Footer simple */}
      <div className="my-8 flex flex-col items-center gap-3 text-sm text-gray-400">
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-600">
            Sobre nosotros
          </a>
          <a href="#" className="hover:text-gray-600">
            Ayuda
          </a>
          <a href="#" className="hover:text-gray-600">
            Blog
          </a>
          <a href="#" className="hover:text-gray-600">
            Contacto
          </a>
        </div>
        <p>© {new Date().getFullYear()} AMPLIX. EDITORIAL AUTHORITY.</p>
      </div>
    </div>
  );
}

export default Register;

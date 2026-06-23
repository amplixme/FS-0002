import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="border-b border-gray-200 px-6 py-4 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo — siempre visible */}
        <Link to="/" className="text-2xl font-bold text-gray-900">
          Amplix
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-md text-gray-600 font-medium">
          <Link to="/" className="border-b-2 border-blue-700 text-blue-700 pb-0.5">
            Inicio
          </Link>
          <Link to="/nosotros" className="hover:text-on-surface transition font-medium">
            Nosotros
          </Link>
          {isAuthenticated && (
            <Link to="/categorias" className="hover:text-on-surface transition font-medium">
              Categorías
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link to="/admin" className="hover:text-gray-900 transition font-bold text-primary">
              Admin
            </Link>
          )}
        </nav>

        {/* Botones derecha — desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-gray-800 font-medium mr-2">Hola, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 font-medium hover:text-red-800 transition cursor-pointer"
              >
                Cerrar Sesión
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm text-blue-700 font-bold uppercase">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 font-medium">
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="text-white bg-blue-700 py-2 px-6 rounded-3xl font-black hover:bg-blue-800 transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa — solo mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span
            className={`w-6 h-0.5 bg-gray-900 block transition-all duration-200 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-gray-900 block transition-all duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-gray-900 block transition-all duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 px-4 text-sm text-gray-600 font-medium pb-4 border-t border-gray-100 pt-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-blue-700 font-semibold">
            Inicio
          </Link>
          <Link to="/nosotros" className="hover:text-gray-900 transition cursor-pointer">
            Nosotros
          </Link>

          {isAuthenticated && (
            <Link to="/categorias" onClick={() => setMenuOpen(false)} className="font-semibold">
              Categorías
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="font-bold text-primary">
              Admin
            </Link>
          )}

          <hr className="border-gray-200" />

          {isAuthenticated ? (
            <>
              <span className="text-gray-800 font-medium">Hola, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-left text-red-600 font-medium cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-blue-700 font-bold"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

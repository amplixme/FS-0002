// frontend/amplix-blog/src/components/Header.jsx

import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Avatar from "./common/Avatar";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="border-b border-outline-variant px-6 py-4 bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="text-2xl font-bold text-on-surface">
          Amplix
        </Link>

        {/* ── Nav desktop ── */}
        <nav className="hidden md:flex items-center gap-6 text-md text-on-surface-variant font-medium">
          <Link to="/" className="border-b-2 border-primary text-primary pb-0.5">
            Inicio
          </Link>
          <Link to="/nosotros" className="hover:text-on-surface transition font-medium">
            Nosotros
          </Link>

          {user?.role === "ADMIN" && (
            <Link to="/categorias" className="hover:text-on-surface transition font-semibold">
              Categorías
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link to="/admin" className="hover:text-on-surface transition font-bold text-primary">
              Admin
            </Link>
          )}

          {user?.role === "COLLABORATOR" && (
            <Link
              to="/collaborator"
              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container hover:opacity-80 transition"
            >
              <span className="material-symbols-outlined text-[14px]">rate_review</span>
              Panel Colaborador
            </Link>
          )}
        </nav>

        {/* ── Botones derecha — desktop ── */}
        <div className="hidden md:flex items-center gap-3">

          {/* Toggle light/dark */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
          >
            {theme === "light" ? <IoMoonOutline size={18} /> : <IoSunnyOutline size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Saludo */}
              <span className="text-on-surface font-medium">
                Hola, {user?.name}
              </span>

              {/* ── Avatar con dropdown ── */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="rounded-full hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Menú de usuario"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {/* ✅ Avatar con foto o inicial */}
                  <Avatar src={user?.avatarUrl} name={user?.name} size="md" />
                </button>

                {/* ── Panel desplegable ── */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-container-lowest border border-outline-variant ambient-shadow z-50 overflow-hidden"
                    role="menu"
                    aria-label="Opciones de usuario"
                  >
                    {/* Cabecera con avatar */}
                    <div className="px-4 py-3 border-b border-outline-variant bg-surface-container-low flex items-center gap-3">
                      {/* ✅ Avatar en la cabecera del dropdown */}
                      <Avatar src={user?.avatarUrl} name={user?.name} size="md" />
                      <div className="min-w-0">
                        <p className="text-xs text-on-surface-variant">Conectado como</p>
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {user?.name}
                        </p>
                      </div>
                    </div>

                    {/* Opciones */}
                    <div className="py-1">

                      {/* Ver Perfil */}
                      <Link
                        to={`/perfil/${user?.id}`}
                        onClick={() => setDropdownOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        Ver perfil
                      </Link>

                      <hr className="border-outline-variant my-1" />

                      {/* Log Out */}
                      <button
                        onClick={handleLogout}
                        role="menuitem"
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Log Out
                      </button>

                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-on-surface-variant font-medium">
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="text-on-primary bg-primary py-2 px-6 rounded-3xl font-black hover:opacity-90 transition"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* ── Botón hamburguesa — solo mobile ── */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
          >
            {theme === "light" ? <IoMoonOutline size={18} /> : <IoSunnyOutline size={18} />}
          </button>
          <button
            className="flex flex-col gap-1.5 p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span className={`w-6 h-0.5 bg-on-surface block transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-6 h-0.5 bg-on-surface block transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-0.5 bg-on-surface block transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Menú mobile ── */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 px-4 text-sm text-on-surface-variant font-medium pb-4 border-t border-outline-variant pt-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-primary font-semibold">
            Inicio
          </Link>
          <Link to="/nosotros" onClick={() => setMenuOpen(false)} className="hover:text-on-surface transition font-medium">
            Nosotros
          </Link>

          {user?.role === "ADMIN" && (
            <Link to="/categorias" onClick={() => setMenuOpen(false)} className="font-semibold">
              Categorías
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="font-bold text-primary">
              Admin
            </Link>
          )}

          {user?.role === "COLLABORATOR" && (
            <Link
              to="/collaborator"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container w-fit"
            >
              <span className="material-symbols-outlined text-[14px]">rate_review</span>
              Panel Colaborador
            </Link>
          )}

          <hr className="border-outline-variant" />

          {isAuthenticated ? (
            <>
              {/* Info usuario mobile — ✅ con Avatar */}
              <div className="flex items-center gap-3">
                <Avatar src={user?.avatarUrl} name={user?.name} size="md" />
                <span className="text-on-surface font-medium truncate">{user?.name}</span>
              </div>

              {/* Ver Perfil mobile */}
              <Link
                to={`/perfil/${user?.id}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                Ver perfil
              </Link>

              {/* Log Out mobile */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-left text-error font-medium cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Iniciar Sesión</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-primary font-bold">
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
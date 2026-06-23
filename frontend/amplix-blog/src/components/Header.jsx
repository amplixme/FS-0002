import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="border-b border-outline-variant px-6 py-4 bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-on-surface">
          Amplix
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-md text-on-surface-variant font-medium">
          <Link to="/" className="border-b-2 border-primary text-primary pb-0.5">
            Inicio
          </Link>
          <Link to="/nosotros" className="hover:text-on-surface transition font-medium">
            Nosotros
          </Link>
          {isAuthenticated && (
            <Link to="/categorias" className="hover:text-on-surface transition font-semibold">
              Categorías
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link to="/admin" className="hover:text-on-surface transition font-bold text-primary">
              Admin
            </Link>
          )}
        </nav>

        {/* Botones derecha — desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
          >
            {theme === "light" ? <IoMoonOutline size={18} /> : <IoSunnyOutline size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <span className="text-on-surface font-medium mr-2">Hola, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-error font-medium hover:opacity-80 transition cursor-pointer"
              >
                Cerrar Sesión
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm text-primary font-bold uppercase">
                {user?.name ? user.name.charAt(0) : "U"}
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

        {/* Botón hamburguesa — solo mobile */}
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
            <span
              className={`w-6 h-0.5 bg-on-surface block transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`w-6 h-0.5 bg-on-surface block transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-6 h-0.5 bg-on-surface block transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 px-4 text-sm text-on-surface-variant font-medium pb-4 border-t border-outline-variant pt-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-primary font-semibold">
            Inicio
          </Link>
          <Link
            to="/nosotros"
            onClick={() => setMenuOpen(false)}
            className="hover:text-on-surface transition font-medium"
          >
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

          <hr className="border-outline-variant" />

          {isAuthenticated ? (
            <>
              <span className="text-on-surface font-medium">Hola, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-left text-error font-medium cursor-pointer"
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
                className="text-primary font-bold"
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

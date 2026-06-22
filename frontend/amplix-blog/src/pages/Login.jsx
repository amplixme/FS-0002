import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { login } from "../services/auth.services";

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login({ email, password });
      authLogin(data.data.token, data.data.user);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-6 bg-background">
      <main className="w-full max-w-[420px] mx-auto">
        <div className="bg-surface-container-lowest w-full min-h-screen md:min-h-fit md:rounded-[16px] ambient-shadow overflow-hidden transition-all duration-300">
          {/* Barra superior degradada */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary to-secondary-container"></div>

          <div className="px-8 pt-12 pb-10 md:px-10">
            {/* Logo */}
            <div className="mb-10 text-center md:text-left">
              <span className="text-2xl font-extrabold tracking-tighter text-primary">
                TuProyecto
              </span>
            </div>

            {/* Encabezado */}
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-[28px] font-bold text-on-surface leading-tight tracking-tight mb-2">
                Iniciar sesión
              </h1>
              <p className="text-on-surface-variant">Ingresa a tu cuenta para continuar</p>
            </header>

            {/* Formulario */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Campo email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="email">
                  Correo electrónico
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <input
                    id="email"
                    className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-surface-container-lowest transition-all"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo contraseña */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-sm font-semibold text-on-surface" htmlFor="password">
                    Contraseña
                  </label>
                  <a
                    className="text-sm font-semibold text-primary hover:text-on-primary-fixed-variant transition-colors"
                    href="#"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input
                    id="password"
                    className="block w-full pl-11 pr-12 py-3.5 bg-surface-container-low border-transparent rounded-xl text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-surface-container-lowest transition-all"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="absolute cursor-pointer inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && <p className="text-error text-sm px-1">{error}</p>}

              {/* Botón submit */}
              <button
                className="w-full bg-primary cursor-pointer text-on-primary font-bold py-4 px-6 rounded-full hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all text-base"
                type="submit"
              >
                Iniciar sesión
              </button>
            </form>

            {/* Separador */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-outline-variant/40"></div>
              <span className="text-sm font-medium text-outline-variant px-2">o</span>
              <div className="flex-1 h-px bg-outline-variant/40"></div>
            </div>

            {/* Botón Google */}
            <div className="grid grid-cols-1 gap-4">
              <button className="flex cursor-pointer items-center justify-center gap-3 w-full py-3 px-6 bg-surface-container-low border border-outline-variant/10 rounded-full hover:bg-surface-container-high transition-colors text-on-surface font-medium">
                <img
                  alt="Google Logo"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfECi-RUlWaa0602E8qzH-FeowJKr4O3C-A0ZGDvurrU1LO7pc3Yb9LTyAsx5HwX8-AZ1bjcOu9F3h_JsicbwQSv_WUy93h4M3o0h6PAkGqO-hk7BZFqZe1dmpkcG0aeAaVUrUUbGMfyFRvw304pPaBz-nVdAuswTMsdvyV0nDxUK5M25oDyjPpXxcwhcNhDWfX05VL2t-ZtHPz6ml7WFktVZVqaBrFfA70QbIBvwI_vQiUXu4AxFo8h1o9IyRqh_vy-dLeKKK-4Se"
                />
                Continuar con Google
              </button>
            </div>

            {/* Footer registro */}
            <footer className="mt-10 text-center">
              <p className="text-on-surface-variant font-medium">
                ¿No tienes cuenta?
                <Link
                  className="text-primary font-bold hover:underline underline-offset-4 decoration-2 ml-1"
                  to="/register"
                >
                  Regístrate
                </Link>
              </p>
            </footer>
          </div>
        </div>

        {/* Créditos */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 px-4 md:px-0 opacity-60">
          <p className="text-xs font-medium text-outline uppercase tracking-widest">
            © 2024 TuProyecto
          </p>
          <div className="flex gap-4">
            <a
              className="text-xs font-semibold text-outline hover:text-primary transition-colors"
              href="#"
            >
              Privacidad
            </a>
            <a
              className="text-xs font-semibold text-outline hover:text-primary transition-colors"
              href="#"
            >
              Términos
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

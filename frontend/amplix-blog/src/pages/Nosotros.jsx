import React, { useState } from "react";
import { sileo } from "sileo";

export default function Nosotros() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    // Simulamos la carga de suscripción
    setTimeout(() => {
      setLoading(false);
      setEmail("");
      sileo.success({
        title: "¡Gracias por suscribirte!",
        description: "Pronto recibirás nuestras novedades.",
        fill: "#171717",
        styles: { title: "text-white!", description: "text-white/75!" },
      });
    }, 1000);
  };

  return (
    <div className="bg-background min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* ── Sección Nuestra Historia ── */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight">
            Nuestra Historia
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Amplix nació con una visión clara: devolver la calidad al contenido online. En un mundo
            digital saturado de ruido, creamos un espacio donde la tecnología y el diseño se unen
            para darle protagonismo a las ideas que importan.
          </p>
        </section>

        {/* ── Grid de Valores ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-center ambient-shadow">
            <span className="material-symbols-outlined text-4xl text-primary mb-3">
              auto_awesome
            </span>
            <h3 className="text-xl font-bold text-on-surface mb-2">Calidad Editorial</h3>
            <p className="text-sm text-on-surface-variant">
              Cuidamos cada palabra y cada píxel para ofrecer la mejor experiencia de lectura.
            </p>
          </div>
          <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-center ambient-shadow">
            <span className="material-symbols-outlined text-4xl text-primary mb-3">group</span>
            <h3 className="text-xl font-bold text-on-surface mb-2">Comunidad Activa</h3>
            <p className="text-sm text-on-surface-variant">
              Fomentamos el debate sano y la interacción entre creadores y lectores.
            </p>
          </div>
          <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/30 text-center ambient-shadow">
            <span className="material-symbols-outlined text-4xl text-primary mb-3">shield</span>
            <h3 className="text-xl font-bold text-on-surface mb-2">Autonomía Total</h3>
            <p className="text-sm text-on-surface-variant">
              Herramientas robustas para que gestiones tu contenido con total libertad.
            </p>
          </div>
        </section>

        {/* ── Sección Boletín ── */}
        <section className="bg-surface-container rounded-3xl p-8 md:p-12 text-center ambient-shadow border border-outline-variant/40">
          <h2 className="text-3xl font-bold text-on-surface mb-4">Suscríbete a nuestro boletín</h2>
          <p className="text-md text-on-surface-variant mb-8 max-w-xl mx-auto">
            Recibe semanalmente una selección con los mejores artículos, historias y debates creados
            por nuestra comunidad, directamente en tu correo.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3 rounded-full bg-surface-container-lowest border border-outline-variant text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-outline"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-on-primary font-bold rounded-full hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Enviando..." : "Suscribirme"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

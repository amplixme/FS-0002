import { useState } from "react";
import { sileo } from "sileo";

export default function Nosotros() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    sileo.success({
      title: "¡Suscripción exitosa!",
      description: "Pronto recibirás nuestras novedades.",
    });
    setEmail("");
  };

  return (
    <div className="bg-background min-h-screen text-on-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Historia */}
        <section className="bg-surface-container-lowest p-8 sm:p-10 rounded-3xl ambient-shadow border border-outline-variant">
          <h1 className="text-4xl font-black mb-6 text-primary tracking-tight">Nuestra Historia</h1>
          <div className="space-y-5 text-on-surface-variant leading-relaxed text-lg">
            <p>
              Amplix nació con una premisa clara: democratizar la creación de contenido editorial de
              alta calidad. En un mundo saturado de información rápida y efímera, creamos un refugio
              para los lectores y escritores que valoran la profundidad, el debate y las ideas bien
              fundamentadas.
            </p>
            <p>
              No somos solo un blog; somos una comunidad curada. Creemos firmemente que las mejores
              historias provienen de las experiencias reales de nuestros usuarios. Por eso, nuestra
              plataforma está abierta para que cualquier persona apasionada por la tecnología, el
              diseño o la opinión pública pueda registrarse y compartir su voz.
            </p>
            <p>
              Cada artículo publicado pasa por una revisión editorial para garantizar un estándar de
              excelencia, asegurando que nuestro ecosistema se mantenga libre de distracciones y
              lleno de valor.
            </p>
            <p className="font-bold text-on-surface mt-6 text-xl">
              Sumate a Amplix. Lee, interactúa, y cuando estés listo, conviértete en autor.
            </p>
          </div>
        </section>

        {/* Newsletter Integrado */}
        <section className="bg-primary text-on-primary p-8 sm:p-12 rounded-3xl ambient-shadow text-center">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">
            Suscribite a nuestro Newsletter
          </h2>
          <p className="mb-8 opacity-90 text-lg max-w-lg mx-auto">
            Recibí las mejores publicaciones, guías y novedades directamente en tu correo. Cero
            spam.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Tu correo electrónico..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3 rounded-full text-on-surface bg-surface-container-lowest border-none focus:ring-2 focus:ring-secondary-container outline-none"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-on-primary text-primary font-black rounded-full hover:opacity-90 transition-opacity cursor-pointer"
            >
              Suscribirme
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

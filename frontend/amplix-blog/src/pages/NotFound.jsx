import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-extrabold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-on-surface mb-2">
          Página no encontrada
        </h1>
        <p className="text-on-surface-variant mb-8">
          La página que buscás no existe o fue movida.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-full font-bold text-on-primary bg-primary hover:bg-on-primary-fixed-variant transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
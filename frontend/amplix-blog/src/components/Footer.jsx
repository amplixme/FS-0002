import React from "react";
import { TbWorld } from "react-icons/tb";
import { IoShareSocialOutline } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-lowest px-6 py-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* izquierda */}
        <div>
          <p className="font-black text-on-surface text-xl">Amplix Editorial</p>
          <p className="text-md text-outline font-semibold">
            © {new Date().getFullYear()} Amplix. Experiencia editorial de primer nivel.
          </p>
        </div>

        {/* derecha */}
        <div className="flex items-center gap-6 text-md text-on-surface-variant font-medium">
          <a href="#" className="hover:text-primary transition">
            Política de Privacidad
          </a>
          <a href="#" className="hover:text-primary transition">
            Términos de Servicio
          </a>
          <a href="#" className="hover:text-primary transition">
            Feed RSS
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition cursor-pointer"
            aria-label="Visitar nuestro sitio web"
          >
            <TbWorld size={16} />
          </button>
          <button
            className="w-8 h-8 rounded-full border border-outline-variant bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition cursor-pointer"
            aria-label="Compartir en redes sociales"
          >
            <IoShareSocialOutline size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

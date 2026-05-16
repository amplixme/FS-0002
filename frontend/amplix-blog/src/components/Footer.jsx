import React from "react";
import { TbWorld } from "react-icons/tb";
import { IoShareSocialOutline } from "react-icons/io5";


const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* izquierda */}
        <div className="">
          <p className="font-black   text-gray-900 text-xl">
            {" "}
            The Curated Canvas
          </p>
          <p className="text-md text-gray-500 font-semibold">
            © {new Date().getFullYear()} Amplix. High-end editorial experience.
          </p>
        </div>

        {/* derecha */}
        <div className="flex items-center gap-6 text-md text-gray-500 font-medium">
          <a href="#" className="hover:text-blue-700 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-700 transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-blue-700 transition">
            RSS Feed
          </a>
        </div>

        {/* Íconos */}
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition">
            <TbWorld size={16} />
          </button>
          <button className="w-8 h-8 rounded-full border border-gray-300 bg-gray-200 flex items-center justify-center text-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition">
            <IoShareSocialOutline size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

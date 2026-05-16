import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="border-b border-gray-200 px-6 py-4 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900">
            Amplix
          </Link>

          {/* Nav destkop */}
          <nav className=" md:flex items-center gap-6 text-md text-gray-600 font-medium">
            <Link
              to="/"
              className=" border-b-2 border-b-blue-700 border-gray-900 text-blue-700 pb-0.5"
            >
              Latest
            </Link>
            <Link to="/popular" className="hover:text-gray-900 transition">
              Popular
            </Link>
            <Link to="/newsletter" className="hover:text-gray-900 transition">
              Newsletter
            </Link>
          </nav>
        </div>

        {/* Botones derecha */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-gray-600 font-medium">
            Log In
          </Link>
          <Link
            to="/register"
            className="text-white bg-blue-700 py-2 px-6 rounded-3xl font-black"
          >
            Subscribe
          </Link>

          {/* Avatar placeholder */}
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600 font-medium">
            U
          </div>
        </div>

        {/* Hamburguesa mobile */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="w-6 h-0.5 bg-gray-900 block"></span>
          <span className="w-6 h-0.5 bg-gray-900 block"></span>
          <span className="w-6 h-0.5 bg-gray-900 block"></span>
        </button>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 px-4 text-sm text-gray-600 font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Latest
          </Link>
          <Link to="/popular" onClick={() => setMenuOpen(false)}>
            Popular
          </Link>
          <Link to="/newsletter" onClick={() => setMenuOpen(false)}>
            Newsletter
          </Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Log In
          </Link>
          <Link to="/register" onClick={() => setMenuOpen(false)}>
            Subscribe
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;

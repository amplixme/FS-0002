// frontend/amplix-blog/src/components/common/Avatar.jsx

/**
 * Componente Avatar reutilizable.
 * - Si hay avatarUrl → muestra la imagen
 * - Si no hay → muestra la inicial del nombre sobre fondo primary/10
 *
 * Props:
 *   @param {string}  src       — URL de la imagen (avatarUrl)
 *   @param {string}  name      — Nombre del usuario (para la inicial y el alt)
 *   @param {string}  size      — "sm" | "md" | "lg" | "xl"  (default: "md")
 *   @param {string}  className — clases extra opcionales
 */

const SIZE_MAP = {
  sm: { container: "w-7 h-7",   text: "text-xs"  },
  md: { container: "w-8 h-8",   text: "text-sm"  },
  lg: { container: "w-10 h-10", text: "text-base" },
  xl: { container: "w-20 h-20", text: "text-3xl"  },
};

export default function Avatar({ src, name, size = "md", className = "" }) {
  const { container, text } = SIZE_MAP[size] ?? SIZE_MAP.md;
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? "Usuario"}
        className={`${container} rounded-full object-cover ring-2 ring-outline-variant/30 flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${container} rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 ${className}`}
      aria-label={name ?? "Usuario"}
    >
      <span className={`${text} font-bold text-primary uppercase select-none`}>
        {initial}
      </span>
    </div>
  );
}
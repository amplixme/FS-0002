import { useState, useRef, useCallback, useEffect } from "react";
import { uploadImage } from "../../services/post.service";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Componente reutilizable de carga de imágenes con Cloudinary.
 *
 * Props:
 * - onUpload      {(url: string|null) => void}  — callback con la URL de Cloudinary al terminar
 * - onRemove      {() => void}                  — callback al quitar la imagen
 * - initialImage  {string}                      — URL inicial para pre-cargar en el preview
 * - label         {string}                      — texto del label (por defecto se infiere del modo)
 * - circlePreview {boolean}                     — true → preview circular para avatares (default: false)
 */
export default function ImageUpload({
  onUpload,
  onRemove,
  initialImage,
  label,
  circlePreview = false,
}) {
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  
  const displayLabel = label ?? (circlePreview ? "Foto de perfil" : "Imagen de portada");

  useEffect(() => {
    if (initialImage) setPreview(initialImage);
  }, [initialImage]);

  const validate = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Solo se permiten imágenes JPG, PNG o WEBP.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `La imagen no puede superar los ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = useCallback(
    async (file) => {
      setError("");
      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setPreview(URL.createObjectURL(file));
      setUploading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 200);

      try {
        const url = await uploadImage(file);
        clearInterval(interval);
        setProgress(100);
        onUpload(url);
      } catch (err) {
        clearInterval(interval);
        setPreview(null);
        setProgress(0);
        setError(err.message || "Error al subir la imagen.");
        onUpload(null);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    if (preview && !initialImage) URL.revokeObjectURL(preview);
    setPreview(null);
    setProgress(0);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
    onUpload(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  /* ── Clases según modo ── */
  const dropZoneBase = "relative overflow-hidden border-2 border-dashed transition-all";
  const dropZoneShape = circlePreview ? "w-24 h-24 rounded-full" : "w-full h-48 rounded-xl";
  const dropZoneCursor = preview ? "cursor-default" : "cursor-pointer";
  const dropZoneColors = isDragging
    ? "border-primary bg-primary/5 scale-[1.03]"
    : preview
      ? "border-transparent"
      : "border-outline-variant bg-surface-container-low hover:bg-surface-container";

  const dropZoneClass = [dropZoneBase, dropZoneShape, dropZoneCursor, dropZoneColors].join(" ");

  return (
    <div className={`space-y-2 ${circlePreview ? "flex flex-col items-center" : ""}`}>
      {/* Label */}
      <label
        className={`block text-sm font-bold text-on-surface ${circlePreview ? "text-center" : ""}`}
      >
        {displayLabel}
        <span className="text-outline font-normal ml-1">(opcional)</span>
      </label>

      {/* Zona drop / preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !preview && inputRef.current?.click()}
        className={dropZoneClass}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />

            {/* Overlay de progreso */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                <span className="text-white text-xs font-semibold">Subiendo...</span>
                {!circlePreview && (
                  <div className="w-2/3 h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                <span className="text-white/70 text-xs">{progress}%</span>
              </div>
            )}

            {/* Botón quitar */}
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Eliminar imagen"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </>
        ) : (
          /* Estado vacío */
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-outline">
            <span
              className={`material-symbols-outlined transition-transform ${
                circlePreview ? "text-3xl" : "text-4xl"
              } ${isDragging ? "scale-110 text-primary" : ""}`}
            >
              {circlePreview ? "account_circle" : "add_photo_alternate"}
            </span>
            {!circlePreview && (
              <>
                <span className="text-sm font-medium">
                  {isDragging ? "Soltá para subir" : "Arrastrá o hacé clic para subir"}
                </span>
                <span className="text-xs">JPG, PNG, WEBP — máx. 5MB</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Barra de progreso exterior (solo modo banner) */}
      {uploading && !circlePreview && (
        <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-error font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

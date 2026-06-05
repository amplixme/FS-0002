import { useState, useRef, useCallback } from "react";
import { uploadImage } from "../../services/post.service";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({ onUpload, onRemove }) {
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0); // 0-100
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  // Validación client-side
  const validate = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Solo se permiten imágenes JPG, PNG o WEBP.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `La imagen no puede superar los ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFile = useCallback(async (file) => {
    setError("");

    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Mostrar preview local inmediatamente
    setPreview(URL.createObjectURL(file));

    // Simular progreso mientras sube
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 85 ? prev + 15 : prev));
    }, 200);

    try {
      const url = await uploadImage(file);
      clearInterval(interval);
      setProgress(100);
      onUpload(url); // Le avisa al padre con la URL de Cloudinary
    } catch (err) {
      clearInterval(interval);
      setPreview(null);
      setProgress(0);
      setError(err.message || "Error al subir la imagen.");
      onUpload(null);
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setProgress(0);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
    onUpload(null);
  };

  // Drag & Drop handlers
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

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-on-surface">
        Imagen de portada
        <span className="text-outline font-normal ml-1">(opcional)</span>
      </label>

      {/* Zona de drop / preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !preview && inputRef.current?.click()}
        className={`relative w-full h-48 rounded-xl overflow-hidden border-2 border-dashed transition-all
          ${preview ? "border-transparent cursor-default" : "cursor-pointer"}
          ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-outline-variant bg-surface-container-low hover:bg-surface-container"}
        `}
      >
        {preview ? (
          <>
            {/* Preview de la imagen */}
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />

            {/* Overlay mientras sube */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                <span className="text-white text-sm font-semibold">
                  Subiendo imagen...
                </span>
                {/* Barra de progreso */}
                <div className="w-2/3 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-white/70 text-xs">{progress}%</span>
              </div>
            )}

            {/* Botón X — solo visible cuando no está subiendo */}
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Eliminar imagen"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            )}
          </>
        ) : (
          /* Estado vacío */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-outline">
            <span
              className={`material-symbols-outlined text-4xl transition-transform ${isDragging ? "scale-110 text-primary" : ""}`}
            >
              add_photo_alternate
            </span>
            <span className="text-sm font-medium">
              {isDragging ? "Soltá para subir" : "Arrastrá o hacé clic para subir"}
            </span>
            <span className="text-xs">JPG, PNG, WEBP — máx. 5MB</span>
          </div>
        )}
      </div>

      {/* Barra de progreso exterior (cuando ya hay preview y está subiendo) */}
      {uploading && (
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
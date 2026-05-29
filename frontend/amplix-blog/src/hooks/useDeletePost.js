import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../services/post.service";

/**
 * Hook que encapsula el flujo de eliminación de un post.
 * Devuelve:
 * - showModal   {boolean}  — controla visibilidad del ConfirmModal
 * - deleting    {boolean}  — true mientras se ejecuta el delete
 * - toast       {object|null} — { message, type } para el Toast
 * - openModal   {function} — abre el modal de confirmación
 * - cancelModal {function} — cierra el modal sin hacer nada
 * - confirmDelete {function} — ejecuta el delete real
 * - clearToast  {function} — limpia el toast
 */
export function useDeletePost(postId) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const openModal = () => setShowModal(true);
  const cancelModal = () => setShowModal(false);
  const clearToast = () => setToast(null);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deletePost(postId);
      setShowModal(false);
      setToast({ message: "Artículo eliminado correctamente.", type: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setShowModal(false);
      setToast({ message: err.message || "Error al eliminar el artículo.", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return { showModal, deleting, toast, openModal, cancelModal, confirmDelete, clearToast };
}
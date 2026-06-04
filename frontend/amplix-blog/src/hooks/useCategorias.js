import { useState, useEffect } from "react";
import {
  getAll,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

export function useCategorias() {
  const [categories, setCategories] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [updating, setUpdating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);  // ← nuevo

  const [toast, setToast] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    setLoadingList(true);
    setListError("");
    try {
      const res = await getAll();
      setCategories(res.data ?? []);
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoadingList(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    try {
      const res = await createCategory({ name: newName, slug: newSlug });
      const created = res.data ?? res;
      setCategories((prev) =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
      );
      setNewName("");
      setNewSlug("");
      setToast({ message: "Categoría creada correctamente.", type: "success" });
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditSlug(cat.slug);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditSlug("");
  }

  async function handleUpdate(id) {
    setUpdating(true);
    try {
      const res = await updateCategory(id, { name: editName, slug: editSlug });
      const updated = res.data ?? res;
      setCategories((prev) =>
        prev
          .map((c) => (c.id === id ? { ...c, ...updated } : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      cancelEdit();
      setToast({ message: "Categoría actualizada correctamente.", type: "success" });
    } catch (err) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setUpdating(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);  // ← limpia error previo antes de reintentar
    try {
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
      setToast({ message: "Categoría eliminada correctamente.", type: "success" });
    } catch (err) {
      setDeleteError(err.message);  // ← muestra el error dentro del modal
    } finally {
      setDeleting(false);
    }
  }

  function openDeleteModal(cat) {
    setDeleteError(null);  // ← limpia error al abrir un modal nuevo
    setDeleteTarget(cat);
  }

  return {
    categories, loadingList, listError,
    newName, setNewName, newSlug, setNewSlug, creating, createError, handleCreate,
    editingId, editName, setEditName, editSlug, setEditSlug, updating,
    startEdit, cancelEdit, handleUpdate,
    deleteTarget, deleting, deleteError,  // ← exporta deleteError
    openDeleteModal,
    cancelDelete: () => setDeleteTarget(null),
    confirmDelete,
    toast,
    clearToast: () => setToast(null),
  };
}
import ConfirmModal from "../components/common/ConfirmModal";
import Toast from "../components/common/Toast";
import CategoryForm from "../components/categories/CategoryForm";
import CategoryList from "../components/categories/CategoryList";
import { useCategorias } from "../hooks/useCategorias";

export default function Categorias() {
  const {
    categories,
    loadingList,
    listError,
    newName,
    setNewName,
    newSlug,
    setNewSlug,
    creating,
    createError,
    handleCreate,
    editingId,
    editName,
    setEditName,
    editSlug,
    setEditSlug,
    updating,
    startEdit,
    cancelEdit,
    handleUpdate,
    deleteTarget,
    deleting,
    deleteError, // ← nuevo
    openDeleteModal,
    cancelDelete,
    confirmDelete,
    toast,
    clearToast,
  } = useCategorias();

  return (
    <>
      <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
        <main className="max-w-4xl mx-auto space-y-8">
          <CategoryForm
            newName={newName}
            setNewName={setNewName}
            newSlug={newSlug}
            setNewSlug={setNewSlug}
            creating={creating}
            createError={createError}
            onSubmit={handleCreate}
          />
          <CategoryList
            categories={categories}
            loadingList={loadingList}
            listError={listError}
            editingId={editingId}
            editName={editName}
            setEditName={setEditName}
            editSlug={editSlug}
            setEditSlug={setEditSlug}
            updating={updating}
            onEdit={startEdit}
            onSave={handleUpdate}
            onCancel={cancelEdit}
            onDelete={openDeleteModal}
          />
        </main>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Eliminar categoría"
        message={
          deleteTarget
            ? `¿Estás seguro de que querés eliminar "${deleteTarget.name}"? Esta acción no se puede deshacer.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={deleting}
        error={deleteError} // ← nuevo
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
    </>
  );
}

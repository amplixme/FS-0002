import api from "./api";

/**
 * Obtiene todas las categorías disponibles.
 * @returns {Promise<{ data: Category[] }>}
 */
export const getAll = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al obtener las categorías"
    );
  }
};

/**
 * Crea una nueva categoría. Requiere rol ADMIN.
 * @param {{ name: string, slug: string }} data
 * @returns {Promise<{ data: Category }>}
 */
export const createCategory = async (data) => {
  try {
    const response = await api.post("/categories", data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al crear la categoría"
    );
  }
};

/**
 * Actualiza una categoría existente. Requiere rol ADMIN.
 * @param {string} id
 * @param {{ name: string, slug: string }} data
 * @returns {Promise<{ data: Category }>}
 */
export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al actualizar la categoría"
    );
  }
};

/**
 * Elimina una categoría. Requiere rol ADMIN.
 * Lanza error 409 si la categoría tiene posts asociados.
 * @param {string} id
 * @returns {Promise<{ data: { message: string } }>}
 */
export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al eliminar la categoría"
    );
  }
};
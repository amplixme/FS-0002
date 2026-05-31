import api from "./api";

/**
 * Obtiene todas las categorías disponibles.
 * Respuesta del servidor: { success: true, data: Category[] }
 * @returns {Promise<{ success: boolean, data: Category[] }>}
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
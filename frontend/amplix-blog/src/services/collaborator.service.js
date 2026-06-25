import api from "./api";

/**
 * Obtiene todos los borradores de usuarios USER pendientes de revisión.
 * Solo accesible para ADMIN y COLLABORATOR.
 */
export const getPendingPosts = async () => {
  try {
    const response = await api.get("/collaborator/pending");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al obtener los borradores pendientes"
    );
  }
};

/**
 * Publica un borrador de usuario USER (published: false → true).
 * @param {number} id - ID del post
 */
export const publishPost = async (id) => {
  try {
    const response = await api.patch(`/collaborator/posts/${id}/publish`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al publicar el post"
    );
  }
};

/**
 * Rechaza (elimina) un borrador de usuario USER.
 * @param {number} id - ID del post
 */
export const rejectPost = async (id) => {
  try {
    const response = await api.delete(`/collaborator/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al rechazar el post"
    );
  }
};

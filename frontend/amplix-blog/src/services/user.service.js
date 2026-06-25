import api from "./api";

/**
 * Obtiene el perfil público de un usuario.
 * @param {string|number} id - ID del usuario
 * @returns {Promise<Object>} Perfil: { id, name, bio, avatarUrl, postCount, createdAt }
 */
export const getProfile = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || "Error al obtener el perfil");
  }
};

/**
 * Obtiene los posts publicados de un usuario.
 * @param {string|number} id - ID del usuario
 * @returns {Promise<Array>} Array de posts publicados
 */
export const getUserPosts = async (id) => {
  try {
    const response = await api.get(`/users/${id}/posts`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al obtener los posts del usuario"
    );
  }
};

/**
 * Actualiza el perfil del usuario autenticado (requiere token).
 * @param {Object} data - { name?, bio?, avatarUrl? }
 * @returns {Promise<Object>} Perfil actualizado
 */
export const updateProfile = async (data) => {
  try {
    const response = await api.put("/users/me", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || "Error al actualizar el perfil");
  }
};

/**
 * Obtiene los borradores propios del usuario autenticado.
 * Requiere token — solo devuelve los del usuario logueado.
 */
export const getMyDrafts = async () => {
  try {
    const response = await api.get("/users/me/drafts");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al obtener tus borradores"
    );
  }
};

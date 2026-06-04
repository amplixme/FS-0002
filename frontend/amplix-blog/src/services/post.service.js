import api from "./api";

/**
 * Obtiene todos los posts.
 * @returns {Promise<Array>} Array de posts
 */
export const getPosts = async (page = 1, category = null) => {
  try {
    const url = category
      ? `/posts?page=${page}&category=${category}`
      : `/posts?page=${page}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al obtener los posts",
    );
  }
};

/**
 * Obtiene un post por su ID.
 * @param {string|number} id - ID del post
 * @returns {Promise<Object>} Post encontrado
 */
export const getPostById = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al obtener el post",
    );
  }
};

/**
 * Crea un nuevo post.
 * @param {Object} data - Datos del post a crear
 * @returns {Promise<Object>} Post creado
 */
export const createPost = async (data) => {
  try {
    const response = await api.post("/posts", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error completo:", error.response?.data);
    throw new Error(
      error.response?.data?.error?.message || "Error al crear el post",
    );
  }
};

/**
 * Actualiza un post existente.
 * @param {string|number} id - ID del post
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} Post actualizado
 */
export const updatePost = async (id, data) => {
  try {
    const response = await api.put(`/posts/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al actualizar el post",
    );
  }
};

/**
 * Elimina un post por su ID.
 * @param {string|number} id - ID del post
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al eliminar el post",
    );
  }
};

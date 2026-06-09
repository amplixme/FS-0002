import api from "./api";

// Obtener comentarios de un post
export const getByPostId = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al cargar comentarios",
    );
  }
};

// Crear comentario
export const create = async (postId, content) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al publicar",
    );
  }
};

// Actualizar comentario (Preparado para el futuro)
export const update = async (id, data) => {
  try {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error("Error al actualizar el comentario");
  }
};

// Eliminar comentario (Preparado para el futuro)
export const remove = async (id) => {
  try {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error al eliminar el comentario");
  }
};

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

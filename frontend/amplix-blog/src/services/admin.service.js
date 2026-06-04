import api from "./api";

export const getStats = async () => {
  try {
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al obtener estadísticas"
    );
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al obtener usuarios"
    );
  }
};

export const createUser = async ({ name, email, password, role }) => {
  try {
    const response = await api.post("/admin/users", { name, email, password, role });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al crear usuario"
    );
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al actualizar usuario"
    );
  }
};

export const changeRole = async (id, role) => {
  try {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al cambiar rol"
    );
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al eliminar usuario"
    );
  }
};

export const getRecentPosts = async () => {
  try {
    const response = await api.get("/admin/posts");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al obtener posts"
    );
  }
};

export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/admin/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al eliminar post"
    );
  }
};

export const getRecentComments = async () => {
  try {
    const response = await api.get("/admin/comments");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al obtener comentarios"
    );
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await api.delete(`/admin/comments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message || "Error al eliminar comentario"
    );
  }
};

import api from "./api";

/**
 * Inicia sesión
 * @param {Object} credentials
 * @returns {Promise<Object>}
 */
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || "Error al iniciar sesión");
  }
};

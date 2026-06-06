import { success } from "../utils/response.js";
import {
  getUserPublicProfile,
  updateUserProfile,
} from "../services/user.service.js";
import CustomError from "../utils/custom-error.js";

/**
 * GET /api/users/:id
 * Perfil público — sin autenticación requerida.
 * Expone: name, bio, avatarUrl, postCount.
 */
export const getPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await getUserPublicProfile(id);
    if (!user) throw new CustomError("Usuario no encontrado", 404);

    return success(res, user);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/me
 * Actualizar propio perfil — requiere autenticación.
 * Campos permitidos: name, bio, avatarUrl.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const updated = await updateUserProfile(userId, req.body);
    return success(res, updated);
  } catch (error) {
    next(error);
  }
};
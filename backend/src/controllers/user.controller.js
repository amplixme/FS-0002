import { success } from "../utils/response.js";
import {
  getUserPublicProfile,
  getUserPublishedPosts,
  updateUserProfile,
  getUserOwnDrafts,
} from "../services/user.service.js";
import CustomError from "../utils/custom-error.js";

/**
 * GET /api/users/:id
 * Perfil público — sin autenticación requerida.
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
 * GET /api/users/:id/posts
 * Posts publicados de un usuario — sin autenticación requerida.
 */
export const getPublicProfilePosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await getUserPublishedPosts(id);
    return success(res, posts);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/me
 * Actualizar propio perfil — requiere autenticación.
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

/**
 * GET /api/users/me/drafts
 * Borradores propios del usuario autenticado.
 * Solo el propio usuario puede ver sus borradores por esta vía.
 */
export const getMyDrafts = async (req, res, next) => {
  try {
    const drafts = await getUserOwnDrafts(req.user.id);
    return success(res, drafts);
  } catch (error) {
    next(error);
  }
};

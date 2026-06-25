import { success } from "../utils/response.js";
import * as collaboratorService from "../services/collaborator.service.js";

/**
 * GET /api/collaborator/pending
 * Lista todos los borradores de usuarios USER pendientes de revisión.
 */
export const getPendingPosts = async (req, res, next) => {
  try {
    const data = await collaboratorService.getPendingUserPosts();
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

/**
 * PATCH /api/collaborator/posts/:id/publish
 * Publica un borrador de usuario USER.
 */
export const publishPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await collaboratorService.publishUserPost(id);
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

/**
 * DELETE /api/collaborator/posts/:id
 * Rechaza (elimina) un borrador de usuario USER.
 */
export const rejectPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await collaboratorService.rejectUserPost(id);
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

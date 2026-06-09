import {
  createComment,
  updateCommentService,
  deleteCommentService,
  getCommentsByPostId,
} from "../services/comment.service.js";
import { success } from "../utils/response.js";

export const createCommentController = async (req, res, next) => {
  try {
    const { content } = req.body;
    const authorId = req.user.id;
    const postId = parseInt(req.params.postId);

    const newComment = await createComment(content, postId, authorId);
    return success(res, newComment, 201);
  } catch (error) {
    next(error);
  }
};

export const updateCommentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { content } = req.body;
    const updatedComment = await updateCommentService(id, content, userId);
    return success(res, updatedComment, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteCommentController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    await deleteCommentService(id, userId, userRole);
    return success(res, { message: "Comentario eliminado correctamente" }, 200);
  } catch (error) {
    next(error);
  }
};

export const getCommentsController = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const comments = await getCommentsByPostId(postId);
    return success(res, comments, 200);
  } catch (error) {
    next(error);
  }
};

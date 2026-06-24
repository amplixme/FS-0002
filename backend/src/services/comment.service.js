import prisma from "../config/prisma.js";
import CustomError from "../utils/custom-error.js";

/**
 * Roles con capacidad de moderación (pueden borrar cualquier comentario).
 */
const MODERATOR_ROLES = ["ADMIN", "COLLABORATOR"];

export const createComment = async (content, postId, authorId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) throw new CustomError("Post no encontrado", 404);

  const comment = await prisma.comment.create({
    data: { content, postId, authorId },
    include: { author: { select: { name: true } } },
  });

  return comment;
};

export const updateCommentService = async (id, content, userId) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new CustomError("Comentario no encontrado", 404);
  // Solo el autor puede editar el contenido de su comentario
  if (comment.authorId !== userId) throw new CustomError("No autorizado", 403);
  const updatedComment = await prisma.comment.update({
    where: { id },
    data: { content },
    include: { author: { select: { name: true } } },
  });
  return updatedComment;
};

export const deleteCommentService = async (id, userId, userRole) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new CustomError("Comentario no encontrado", 404);
  // El autor puede borrar su propio comentario; ADMIN y COLLABORATOR pueden borrar cualquiera
  if (comment.authorId !== userId && !MODERATOR_ROLES.includes(userRole)) {
    throw new CustomError("No autorizado", 403);
  }
  await prisma.comment.delete({ where: { id } });
  return true;
};

export const getCommentsByPostId = async (postId) => {
  const numericId = parseInt(postId);
  if (isNaN(numericId)) return [];
  const comments = await prisma.comment.findMany({
    where: { postId: numericId },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true, avatarUrl: true },
      },
    },
  });
  return comments;
};

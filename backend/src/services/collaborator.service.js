import prisma from "../config/prisma.js";
import CustomError from "../utils/custom-error.js";

/**
 * Devuelve todos los borradores de usuarios con rol USER pendientes de revisión.
 * Accesible solo por ADMIN y COLLABORATOR.
 */
export const getPendingUserPosts = async () => {
  const posts = await prisma.post.findMany({
    where: {
      published: false,
      author: { role: "USER" },
    },
    include: {
      author: {
        select: { id: true, name: true, email: true, role: true },
      },
      categories: true,
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return posts.map(({ _count, ...rest }) => ({
    ...rest,
    commentCount: _count.comments,
  }));
};

/**
 * Publica un borrador de un usuario USER.
 * Valida que el post exista, no esté publicado y pertenezca a un USER.
 */
export const publishUserPost = async (postId) => {
  const numericId = parseInt(postId);
  if (isNaN(numericId)) throw new CustomError("ID de post inválido", 400);

  const post = await prisma.post.findUnique({
    where: { id: numericId },
    include: { author: { select: { id: true, role: true } } },
  });

  if (!post) throw new CustomError("Post no encontrado", 404);
  if (post.published) throw new CustomError("El post ya está publicado", 400);
  if (post.author.role !== "USER") {
    throw new CustomError(
      "Solo podés publicar borradores de usuarios regulares",
      403
    );
  }

  return prisma.post.update({
    where: { id: numericId },
    data: { published: true },
    include: {
      author: { select: { name: true, email: true, role: true } },
      categories: true,
    },
  });
};

/**
 * Rechaza (elimina) un borrador de un usuario USER.
 * Valida que el post exista, no esté publicado y pertenezca a un USER.
 */
export const rejectUserPost = async (postId) => {
  const numericId = parseInt(postId);
  if (isNaN(numericId)) throw new CustomError("ID de post inválido", 400);

  const post = await prisma.post.findUnique({
    where: { id: numericId },
    include: { author: { select: { id: true, role: true } } },
  });

  if (!post) throw new CustomError("Post no encontrado", 404);
  if (post.published) throw new CustomError("No podés rechazar un post ya publicado", 400);
  if (post.author.role !== "USER") {
    throw new CustomError(
      "Solo podés rechazar borradores de usuarios regulares",
      403
    );
  }

  await prisma.post.delete({ where: { id: numericId } });
  return { message: "Borrador rechazado y eliminado correctamente" };
};

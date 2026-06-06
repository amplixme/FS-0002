import prisma from "../config/prisma.js";

/**
 * Devuelve el perfil público de un usuario.
 * NUNCA incluye password ni email.
 * Incluye postCount y createdAt (para "Miembro desde").
 */
export const getUserPublicProfile = async (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) return null;

  const user = await prisma.user.findUnique({
    where: { id: numericId },
    select: {
      id: true,
      name: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,          // ← necesario para "Miembro desde [fecha]"
      _count: {
        select: {
          posts: { where: { published: true } },
        },
      },
    },
  });

  if (!user) return null;

  // Aplanar _count para una respuesta más limpia
  const { _count, ...rest } = user;
  return { ...rest, postCount: _count.posts };
};

/**
 * Devuelve los posts publicados de un usuario dado su ID.
 * Incluye autor y categorías para que el PostCard funcione correctamente.
 */
export const getUserPublishedPosts = async (id) => {
  const numericId = parseInt(id);
  if (isNaN(numericId)) return [];

  return prisma.post.findMany({
    where: { authorId: numericId, published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      categories: true,
    },
  });
};

/**
 * Actualiza el perfil del usuario autenticado.
 * Solo permite modificar name, bio y avatarUrl.
 * Devuelve los campos del perfil (sin password).
 */
export const updateUserProfile = async (id, data) => {
  const { name, bio, avatarUrl } = data;

  const user = await prisma.user.update({
    where: { id },
    data: { name, bio, avatarUrl },
    select: {
      id: true,
      name: true,
      bio: true,
      avatarUrl: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return user;
};
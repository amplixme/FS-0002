import prisma from "../config/prisma.js";

/**
 * Devuelve el perfil público de un usuario.
 * NUNCA incluye password ni email.
 * Incluye el conteo de posts publicados.
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
 * Actualiza el perfil del usuario autenticado.
 * Solo permite modificar name, bio y avatarUrl.
 * Devuelve los campos del perfil (sin password).
 */
export const updateUserProfile = async (id, data) => {
  const { name, bio, avatarUrl } = data;

  const user = await prisma.user.update({
    where: { id },
    data: { name, bio, avatarUrl },   // ← el objeto whitelist, no `data`
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
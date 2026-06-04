import prisma from "../config/prisma.js";
import CustomError from "../utils/custom-error.js";
import { createHash } from "../utils/user-utils.js";

export const getStats = async () => {
  const now = new Date();
  const startOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay()
  );

  const [totalUsers, totalPosts, totalComments, weekPosts, postsByCategory] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.post.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.category.findMany({
        select: {
          name: true,
          slug: true,
          _count: { select: { posts: true } },
        },
      }),
    ]);

  return {
    totalUsers,
    totalPosts,
    totalComments,
    weekPosts,
    postsByCategory: postsByCategory.map((c) => ({
      name: c.name,
      slug: c.slug,
      count: c._count.posts,
    })),
  };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    postCount: u._count.posts,
  }));
};

export const createUserAdmin = async ({ name, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new CustomError("El email ya está registrado", 409);

  const hashedPassword = await createHash(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role ?? "USER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};

export const updateUserRole = async (targetId, requesterId, newRole) => {
  if (targetId === requesterId) {
    throw new CustomError("No podés cambiar tu propio rol", 403);
  }

  const user = await prisma.user.findUnique({ where: { id: targetId } });
  if (!user) throw new CustomError("Usuario no encontrado", 404);

  return prisma.user.update({
    where: { id: targetId },
    data: { role: newRole },
    select: { id: true, name: true, email: true, role: true },
  });
};

export const updateUser = async (targetId, requesterId, data) => {
  const user = await prisma.user.findUnique({ where: { id: targetId } });
  if (!user) throw new CustomError("Usuario no encontrado", 404);

  if (data.email && data.email !== user.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new CustomError("El email ya está en uso", 409);
  }

  if (data.role && targetId === requesterId) {
    throw new CustomError("No podés cambiar tu propio rol", 403);
  }

  const allowedFields = {};
  if (data.name) allowedFields.name = data.name;
  if (data.email) allowedFields.email = data.email;
  if (data.role) allowedFields.role = data.role;

  return prisma.user.update({
    where: { id: targetId },
    data: allowedFields,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
};

export const deleteUser = async (targetId, requesterId) => {
  if (targetId === requesterId) {
    throw new CustomError("No podés eliminarte a vos mismo", 403);
  }

  const user = await prisma.user.findUnique({ where: { id: targetId } });
  if (!user) throw new CustomError("Usuario no encontrado", 404);

  // 1. Eliminar comentarios escritos por este usuario
  await prisma.comment.deleteMany({ where: { authorId: targetId } });
  // 2. Eliminar posts del usuario (la DB cascadea los comentarios de OTROS usuarios en esos posts)
  await prisma.post.deleteMany({ where: { authorId: targetId } });
  // 3. Eliminar el usuario
  await prisma.user.delete({ where: { id: targetId } });

  return { message: "Usuario eliminado correctamente" };
};

export const deletePostAdmin = async (postId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new CustomError("Post no encontrado", 404);

  await prisma.post.delete({ where: { id: postId } });
  return { message: "Post eliminado correctamente" };
};

export const deleteCommentAdmin = async (commentId) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new CustomError("Comentario no encontrado", 404);

  await prisma.comment.delete({ where: { id: commentId } });
  return { message: "Comentario eliminado correctamente" };
};

export const getRecentPosts = async () => {
  return prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      categories: true,
    },
  });
};

export const getRecentComments = async () => {
  return prisma.comment.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      post: { select: { id: true, title: true } },
    },
  });
};

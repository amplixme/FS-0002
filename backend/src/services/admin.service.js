import prisma from "../config/prisma.js";
import CustomError from "../utils/custom-error.js";
import { createHash } from "../utils/user-utils.js";

export const getStats = async () => {
  const now = new Date();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalPosts,
    totalComments,
    weekPosts,
    postsByCategory,
    usersThisMonth,
    usersLastMonth,
    lastWeekPosts,
    lastComment,
  ] = await Promise.all([
    prisma.user.count(),

    // solo posts publicados
    prisma.post.count({
      where: { published: true },
    }),

    prisma.comment.count(),

    // solo posts publicados esta semana
    prisma.post.count({
      where: {
        published: true,
        createdAt: { gte: startOfWeek },
      },
    }),

    // postsByCategory solo publicados
    prisma.category.findMany({
      select: {
        name: true,
        slug: true,
        _count: {
          select: {
            posts: {
              where: { published: true },
            },
          },
        },
      },
    }),

    // Usuarios creados este mes
    prisma.user.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    }),

    // Usuarios creados el mes pasado
    prisma.user.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lt: startOfMonth,
        },
      },
    }),

    // solo posts publicados semana anterior
    prisma.post.count({
      where: {
        published: true,
        createdAt: {
          gte: startOfLastWeek,
          lt: startOfWeek,
        },
      },
    }),

    // Último comentario
    prisma.comment.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  // Calcular crecimiento de usuarios comparando con mes pasado
  const userGrowth =
    usersLastMonth > 0
      ? (((usersThisMonth - usersLastMonth) / usersLastMonth) * 100).toFixed(1)
      : usersThisMonth > 0
        ? 100
        : 0;

  // Calcular minutos desde el último comentario
  const lastCommentMinutes = lastComment
    ? Math.floor((now.getTime() - new Date(lastComment.createdAt).getTime()) / 60000)
    : null;

  // Calcular crecimiento de posts vs semana anterior
  const weekGrowth =
    lastWeekPosts > 0
      ? ((weekPosts - lastWeekPosts) / lastWeekPosts * 100).toFixed(1)
      : weekPosts > 0
        ? 100
        : 0;

  // Objetivo semanal
  const weekGoal = 5;

  return {
    totalUsers,
    totalPosts,
    totalComments,
    weekPosts,
    userGrowth,
    lastCommentMinutes,
    weekGrowth,
    weekGoal,
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
      avatarUrl: true,
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
    avatarUrl: u.avatarUrl,
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

  await prisma.comment.deleteMany({ where: { authorId: targetId } });
  await prisma.post.deleteMany({ where: { authorId: targetId } });
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

// getRecentPosts solo muestra posts publicados
export const getRecentPosts = async () => {
  return prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
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
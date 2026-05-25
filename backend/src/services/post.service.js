// src/services/post.service.js
import prisma from "../config/prisma.js"; // ← importar el singleton

export const createPost = async (title, content, authorId) => {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return post;
};

export const getAllPosts = async () => {
  const post = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return post;
};

export const getPostById = async (id) => {
  const numericId = parseInt(id);

  if (isNaN(numericId)) return null;

  const post = await prisma.post.findUnique({
    where: { id: numericId },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return post;
};

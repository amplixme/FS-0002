// src/services/post.service.js
import { promise } from "zod";
import prisma from "../config/prisma.js"; // ← importar el singleton

export const createPost = async (title, content, authorId, coverImage,published) => {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
      coverImage,
      published
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  return post;
};

export const getAllPosts = async (page = 1, limit = 4) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        author: {
          select: { name: true },
        },
      },
    }),
    prisma.post.count({
      where: { published: true },
    }),
  ]);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
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

export const updatePostService = async (id, data) => {
  const numericId = parseInt(id);
  const post = await prisma.post.update({
    where: { id: numericId },
    data,
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return post;
};

export const deletePostService = async (id) => {
  const numericId = parseInt(id);
  await prisma.post.delete({
    where: { id: numericId },
  });
  return true;
};

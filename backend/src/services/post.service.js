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
import prisma from "../config/prisma.js";

export const createPost = async (
  title,
  content,
  authorId,
  coverImage,
  published,
  categories = [],
) => {
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
      coverImage,
      published,
      categories: {
        connect: categories.map((id) => ({ id })),
      },
    },
    include: {
      author: { select: { name: true, email: true } },
      categories: true,
    },
  });

  return post;
};

export const getAllPosts = async (page = 1, limit = 4, categorySlug = null) => {
  const skip = (page - 1) * limit;

  const whereClause = { published: true };

  if (categorySlug) {
    whereClause.categories = {
      some: {
        slug: categorySlug,
      },
    };
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        author: {
          select: { name: true },
        },
        categories: true,
        _count: { select: { comments: true } },
      },
    }),
    prisma.post.count({
      where: whereClause,
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
        select: { name: true, email: true },
      },
      categories: true,
    },
  });
  return post;
};

export const updatePostService = async (id, data) => {
  const { categories, ...restData } = data;
  const numericId = parseInt(id);

  const post = await prisma.post.update({
    where: { id: numericId },
    data: {
      ...restData,
      // Usamos set para reemplazar las categorías actuales por las nuevas
      ...(categories && {
        categories: {
          set: categories.map((id) => ({ id })),
        },
      }),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
      categories: true,
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

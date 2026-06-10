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

export const getAllPosts = async (
  page = 1,
  limit = 6,
  categorySlug = null,
  sort = "newest",
) => {
  const skip = (page - 1) * limit;

  const whereClause = { published: true };

  if (categorySlug) {
    whereClause.categories = {
      some: {
        slug: categorySlug,
      },
    };
  }

  // Lógica de ordenamiento dinámico
  let orderByClause;
  if (sort === "oldest") {
    orderByClause = { createdAt: "asc" };
  } else if (sort === "comments") {
    orderByClause = { comments: { _count: "desc" } };
  } else {
    orderByClause = { createdAt: "desc" };
  }

  const [rawPosts, total] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
      orderBy: orderByClause,
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

  const data = rawPosts.map(({ _count, ...rest }) => ({
    ...rest,
    commentCount: _count.comments,
  }));

  return {
    data,
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

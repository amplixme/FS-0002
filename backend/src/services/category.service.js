import prisma from "../config/prisma.js";
import CustomError from "../utils/custom-error.js";

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true },  // ← agrega { _count: { posts: N } } a cada categoría
      },
    },
  });
  return categories;
};

export const createCategory = async (name, slug) => {
  const category = await prisma.category.create({
    data: { name, slug },
  });
  return category;
};

export const updateCategory = async (id, name, slug) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new CustomError("Categoría no encontrada", 404);

  const category = await prisma.category.update({
    where: { id },
    data: { name, slug },
  });
  return category;
};

export const deleteCategory = async (id) => {
  const existing = await prisma.category.findUnique({
    where: { id },
    include: { posts: true },
  });

  if (!existing) throw new CustomError("Categoría no encontrada", 404);

  if (existing.posts.length > 0) {
    throw new CustomError(
      "No se puede eliminar una categoría con posts asociados",
      409
    );
  }

  await prisma.category.delete({ where: { id } });
};
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mockeamos el cliente de Prisma de forma completa antes de importar el servicio
vi.mock("../config/prisma.js", () => ({
  default: {
    post: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import {
  createPost,
  getAllPosts,
  getPostById,
  updatePostService,
  deletePostService,
} from "../services/post.service.js";
import prisma from "../config/prisma.js";

// Fixture base reutilizable para los posts
const MOCK_POST = {
  id: 1,
  title: "Publicación de Prueba",
  content: "Contenido detallado del artículo de prueba.",
  authorId: 10,
  coverImage: "imagen-ejemplo.jpg",
  published: true,
  createdAt: "2026-06-11T00:00:00.000Z",
  author: { name: "Santiago Molina" },
  categories: [{ id: 1, name: "Desarrollo", slug: "desarrollo" }],
  _count: { comments: 3 },
};

describe("PostService Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Test para createPost
  it("createPost › debería crear un post exitosamente conectando las categorías provistas", async () => {
    prisma.post.create.mockResolvedValue(MOCK_POST);

    const result = await createPost(
      "Publicación de Prueba",
      "Contenido detallado del artículo de prueba.",
      10,
      "imagen-ejemplo.jpg",
      true,
      [1],
    );

    expect(prisma.post.create).toHaveBeenCalledOnce();
    expect(result).toEqual(MOCK_POST);
  });

  // 2. Test para getAllPosts (Paginación y formato)
  it("getAllPosts › debería retornar la estructura paginada correcta con la propiedad data", async () => {
    // Simulamos la respuesta estructurada de Prisma con el mapeo interno de comentarios
    prisma.post.findMany.mockResolvedValue([
      { ...MOCK_POST, _count: { comments: 5 } },
    ]);
    prisma.post.count.mockResolvedValue(1);

    const result = await getAllPosts(1, 6);

    expect(result).toHaveProperty("data");
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
    expect(result.data[0].commentCount).toBe(5);
  });

  // 3. Test para getAllPosts con filtro de categoría
  it("getAllPosts › debería estructurar la query de filtrado cuando se provee un categorySlug", async () => {
    prisma.post.findMany.mockResolvedValue([]);
    prisma.post.count.mockResolvedValue(0);

    await getAllPosts(1, 6, "desarrollo");

    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          categories: { some: { slug: "desarrollo" } },
        }),
      }),
    );
  });

  // 4. Test para getPostById exitoso
  it("getPostById › debería retornar el objeto del post si el ID existe en el sistema", async () => {
    prisma.post.findUnique.mockResolvedValue(MOCK_POST);

    const result = await getPostById(1);

    expect(prisma.post.findUnique).toHaveBeenCalledOnce();
    expect(result).toEqual(MOCK_POST);
  });

  // 5. Test para getPostById fallido (ID inválido - NaN)
  it("getPostById › debería retornar null de forma temprana si el ID no es numérico (NaN)", async () => {
    const result = await getPostById("id-invalido");

    expect(prisma.post.findUnique).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  // 6. Test para getPostById no encontrado (Base para el error 404)
  it("getPostById › debería retornar null si el ID es numérico pero no existe en la base de datos", async () => {
    prisma.post.findUnique.mockResolvedValue(null);

    const result = await getPostById(999);

    expect(prisma.post.findUnique).toHaveBeenCalledOnce();
    expect(result).toBeNull();
  });

  // 7. Test para updatePostService
  it("updatePostService › debería actualizar y retornar el post modificado llamando a la BD", async () => {
    prisma.post.update.mockResolvedValue({
      ...MOCK_POST,
      title: "Título Modificado",
    });

    const result = await updatePostService(1, {
      title: "Título Modificado",
      categories: [1],
    });

    expect(prisma.post.update).toHaveBeenCalledOnce();
    expect(result.title).toBe("Título Modificado");
  });

  // 8. Test para deletePostService
  it("deletePostService › debería invocar el borrado físico en Prisma y retornar true", async () => {
    prisma.post.delete.mockResolvedValue(MOCK_POST);

    const result = await deletePostService(1);

    expect(prisma.post.delete).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });
});

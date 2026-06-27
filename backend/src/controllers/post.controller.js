import { success } from "../utils/response.js";
import {
  createPost,
  getAllPosts,
  getPostById as getPostByIdService,
  updatePostService,
  deletePostService,
} from "../services/post.service.js";
import CustomError from "../utils/custom-error.js";

/**
 * Roles que pueden publicar directamente.
 * USER siempre queda en borrador.
 */
const CAN_PUBLISH_ROLES = ["ADMIN", "COLLABORATOR"];

export const create = async (req, res, next) => {
  try {
    const { title, content, published, coverImage, categories } = req.body;
    const authorId = req.user.id;
    const userRole = req.user.role;

    // USER: siempre borrador, sin importar lo que mande el cliente
    const canPublish = CAN_PUBLISH_ROLES.includes(userRole);
    const publishedBool = canPublish ? published === "true" : false;

    const parsedCategories = categories ?? [];

    const newPost = await createPost(
      title,
      content,
      authorId,
      coverImage ?? null,
      publishedBool,
      parsedCategories
    );

    return success(res, newPost, 201);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const category = req.query.category;
    const search = req.query.search?.trim() || null;

    const VALID_SORTS = ["newest", "oldest", "comments"];
    const sort = VALID_SORTS.includes(req.query.sort) ? req.query.sort : "newest";

    const result = await getAllPosts(page, limit, category, sort, search);

    return success(res, result);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getPostByIdService(id);
    if (!post) throw new CustomError("Post no encontrado", 404);
    return success(res, post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, published, coverImage, categories } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const parsedCategories = categories ? JSON.parse(categories) : [];

    const post = await getPostByIdService(id);
    if (!post) throw new CustomError("Post no encontrado", 404);

    const isAuthor = post.authorId === userId;
    const isAdmin = userRole === "ADMIN";
    const isCollaborator = userRole === "COLLABORATOR";
    const isUser = userRole === "USER";

    /**
     * Matriz de permisos para edición:
     * - ADMIN:        puede editar cualquier post
     * - Autor USER:   solo sus propios borradores (no publicados)
     * - Autor COLLABORATOR: sus propios posts (cualquier estado)
     * - COLLABORATOR (no autor): borradores de usuarios USER únicamente
     */
    if (!isAdmin) {
      if (isAuthor) {
        // USER no puede editar posts ya publicados
        if (isUser && post.published) {
          throw new CustomError(
            "No podés editar un post que ya fue publicado. Contactá a un colaborador.",
            403
          );
        }
        // COLLABORATOR y USER pueden editar sus propios borradores
        // COLLABORATOR además puede editar sus propios posts publicados
      } else if (isCollaborator && post.author?.role === "USER" && !post.published) {
        // COLLABORATOR puede editar borradores de USER para corregir antes de publicar
      } else {
        throw new CustomError("No tienes permiso para modificar este post", 403);
      }
    }

    const canPublish = CAN_PUBLISH_ROLES.includes(userRole);
    const publishedBool = canPublish ? published === "true" : post.published;

    const updatedPost = await updatePostService(id, {
      title,
      content,
      published: publishedBool,
      coverImage: coverImage ?? post.coverImage,
      categories: parsedCategories,
    });
    return success(res, updatedPost, 200);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const post = await getPostByIdService(id);
    if (!post) throw new CustomError("Post no encontrado", 404);

    const isAuthor = post.authorId === userId;
    const isAdmin = userRole === "ADMIN";
    const isCollaborator = userRole === "COLLABORATOR";

    /**
     * Matriz de permisos para eliminación:
     * - ADMIN:        puede eliminar cualquier post
     * - Autor:        puede eliminar sus propios posts (cualquier estado)
     * - COLLABORATOR (no autor): puede rechazar/eliminar borradores de USER
     */
    if (!isAdmin) {
      if (isAuthor) {
        // El autor siempre puede eliminar sus propios posts
      } else if (isCollaborator && post.author?.role === "USER" && !post.published) {
        // COLLABORATOR puede rechazar (eliminar) borradores pendientes de USER
      } else {
        throw new CustomError("No tienes permiso para eliminar este post", 403);
      }
    }

    await deletePostService(id);
    return success(res, { message: "Post eliminado correctamente" }, 200);
  } catch (error) {
    next(error);
  }
};

export const publishPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    // Solo ADMIN y COLLABORATOR pueden publicar
    if (!CAN_PUBLISH_ROLES.includes(userRole)) {
      throw new CustomError("No tienes permiso para publicar posts", 403);
    }

    const post = await getPostByIdService(id);
    if (!post) throw new CustomError("Post no encontrado", 404);

    if (post.published) {
      throw new CustomError("El post ya está publicado", 400);
    }

    const updatedPost = await updatePostService(id, {
      title: post.title,
      content: post.content,
      published: true,
      coverImage: post.coverImage,
      categories: post.categories.map((c) => c.id),
    });

    return success(res, updatedPost, 200);
  } catch (error) {
    next(error);
  }
};
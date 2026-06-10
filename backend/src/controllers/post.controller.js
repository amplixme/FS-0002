import { success } from "../utils/response.js";
import {
  createPost,
  getAllPosts,
  getPostById as getPostByIdService,
  updatePostService,
  deletePostService,
} from "../services/post.service.js";
import CustomError from "../utils/custom-error.js";

export const create = async (req, res, next) => {
  try {
    const { title, content, published, coverImage, categories } = req.body;
    const authorId = req.user.id;
    const publishedBool = published === "true";
    const parsedCategories = categories ?? [];

    const newPost = await createPost(
      title,
      content,
      authorId,
      coverImage ?? null,
      publishedBool,
      parsedCategories,
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

    const VALID_SORTS = ["newest", "oldest", "comments"];
    const sort = VALID_SORTS.includes(req.query.sort)
      ? req.query.sort
      : "newest";

    const result = await getAllPosts(page, limit, category, sort);

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
    const publishedBool = published === "true";
    const parsedCategories = categories ? JSON.parse(categories) : [];

    const post = await getPostByIdService(id);
    if (!post) throw new CustomError("Post no encontrado", 404);

    if (post.authorId !== userId && userRole !== "ADMIN") {
      throw new CustomError("No tienes permiso para modificar este post", 403);
    }

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

    if (post.authorId !== userId && userRole !== "ADMIN") {
      throw new CustomError("No tienes permiso para eliminar este post", 403);
    }

    await deletePostService(id);
    return success(res, { message: "Post eliminado correctamente" }, 200);
  } catch (error) {
    next(error);
  }
};

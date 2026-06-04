import { success } from "../utils/response.js";
import { uploadImage } from "../utils/uploadImage.js";
import {
  createPost,
  getAllPosts,
  getPostById as getPostByIdService,
  updatePostService,
  deletePostService,
} from "../services/post.service.js";
import CustomError from "../utils/custom-error.js";
import { upload } from "../middlewares/upload.middleware.js";

export const create = async (req, res, next) => {
  try {
    console.log("req.body después de validación:", req.body);

    const { title, content, published } = req.body;
    const authorId = req.user.id;
    const publishedBool = published === "true";

    let coverImage = null;
    if (req.file) {
      coverImage = await uploadImage(req.file.buffer, req.file.originalname);
    }

    const newPost = await createPost(
      title,
      content,
      authorId,
      coverImage,
      publishedBool,
    );

    return success(res, newPost, 201);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    console.log("page recibida:", page);
    const category = req.query.category;
    const result = await getAllPosts(page, 4, category);
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
    const data = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const post = await getPostByIdService(id);
    if (!post) throw new CustomError("Post no encontrado", 404);

    if (post.authorId !== userId && userRole !== "ADMIN") {
      throw new CustomError("No tienes permiso para modificar este post", 403);
    }

    const updatedPost = await updatePostService(id, data);
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

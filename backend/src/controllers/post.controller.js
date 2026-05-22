import { success } from "../utils/response.js";
import {
  createPost,
  getAllPost,
  getPostById as getPostByIdService
} from "../services/post.service.js";
import CustomError from "../utils/custom-error.js";

export const create = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const newPost = await createPost(title, content, authorId);

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await getAllPost();
    return success(res, post);
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getPostByIdService(id)

    if(!post) throw new CustomError("Post no encontrado", 404)

    return success(res, post)
  } catch (error) {
    next(error);
  }
};

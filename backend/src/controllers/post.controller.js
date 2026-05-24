import { createPost } from "../services/post.service.js";
import { success } from "../utils/response.js"

export const create = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const newPost = await createPost(title, content, authorId);

    return success(res,newPost,201)
  } catch (error) {
    next(error);
  }
};
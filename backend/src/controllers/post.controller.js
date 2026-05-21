import { createPost } from "../services/post.service.js";

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
import { createPost } from "../services/post.service.js";

export const create = async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const newPost = await createPost(title, content, authorId);

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el post", error: error.message });
  }
};
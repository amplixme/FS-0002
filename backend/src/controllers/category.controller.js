import { success } from "../utils/response.js";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category.service.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    return success(res, categories);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const category = await createCategory(name, slug);
    return success(res, category, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;
    const category = await updateCategory(id, name, slug);
    return success(res, category);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCategory(id);
    return success(res, { message: "Categoría eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};
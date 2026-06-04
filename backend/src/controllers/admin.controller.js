import { success } from "../utils/response.js";
import * as adminService from "../services/admin.service.js";

export const getStats = async (req, res, next) => {
  try {
    const data = await adminService.getStats();
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const data = await adminService.getAllUsers();
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const data = await adminService.createUserAdmin({ name, email, password, role });
    return success(res, data, 201);
  } catch (e) {
    next(e);
  }
};

export const changeRole = async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.id);
    const requesterId = req.user.id;
    const { role } = req.body;
    const data = await adminService.updateUserRole(targetId, requesterId, role);
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.id);
    const requesterId = req.user.id;
    const data = await adminService.updateUser(targetId, requesterId, req.body);
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const targetId = parseInt(req.params.id);
    const requesterId = req.user.id;
    const data = await adminService.deleteUser(targetId, requesterId);
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const data = await adminService.deletePostAdmin(postId);
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id; // UUID string
    const data = await adminService.deleteCommentAdmin(commentId);
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

export const getRecentPosts = async (req, res, next) => {
  try {
    const data = await adminService.getRecentPosts();
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

export const getRecentComments = async (req, res, next) => {
  try {
    const data = await adminService.getRecentComments();
    return success(res, data);
  } catch (e) {
    next(e);
  }
};

import { register as registerService, login as loginService } from "../services/auth.service.js";
import { success } from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    await registerService(req.body);
    return success(res, { message: "Usuario registrado exitosamente" }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await loginService(req.body);
    return success(res, data);
  } catch (error) {
    next(error);
  }
};

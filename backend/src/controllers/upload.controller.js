import { uploadImage } from "../utils/uploadImage.js";
import { success } from "../utils/response.js";
import CustomError from "../utils/custom-error.js";

export const uploadImageController = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError("No se envió ninguna imagen", 400);
    }

    const url = await uploadImage(req.file.buffer);

    return success(res, { url }, 200);
  } catch (error) {
    next(error);
  }
};

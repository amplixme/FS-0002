import { register as registerService} from "../services/auth.service.js"
import { success } from "../utils/response.js"

export const register = async (req, res, next) => {
    try {
        await registerService(req.body)
        return success (res, {message: "Usuario registrado exitosamente"}, 201)
    } catch (error) {
        next(error)
    }
}
import { Router } from "express"
import { register } from "../controllers/auth.controller.js"
import { validateBody } from "../middlewares/validate.middleware.js"
import { registerSchema } from "../schemas/auth.schema.js"

const router = Router()

router.post("/register", validateBody(registerSchema), register)

export default router
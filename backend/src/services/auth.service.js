import prisma from "../config/prisma.js";
import CustomError from "../utils/custom-error.js";
import { createHash, isValid } from "../utils/user-utils.js";
import jwt from "jsonwebtoken";

export const register = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) throw new CustomError("El email ya esta registrado", 409);

  const hashedPassword = await createHash(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // No revelar si el error es de email o contraseña
  if (!user) throw new CustomError("Credenciales inválidas", 401);

  const passwordMatch = await isValid(password, user.password);

  if (!passwordMatch) throw new CustomError("Credenciales inválidas", 401);

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};
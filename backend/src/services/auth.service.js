import prisma from "../config/prisma.js";
import CustomError from "../utils/custom-error.js";
import { createHash } from "../utils/user-utils.js";

export const register = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) throw new CustomError("El email ya esta registrado", 409)

    const hashedPassword = await createHash(password)

    const user = await prisma.user.create({
      data:{
        name,
        email,
        password: hashedPassword
      }
    })

    return user
};

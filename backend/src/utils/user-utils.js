import { genSaltSync, hashSync, compareSync } from "bcrypt";

export const createHash = (password) => {
  return hashSync(password, genSaltSync(10));
};

export const isValid = (passwordPlain, passwordHash) => {
  return compareSync(passwordPlain, passwordHash);
};
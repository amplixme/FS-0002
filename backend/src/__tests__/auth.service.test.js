import { describe, it, expect, vi, beforeEach } from "vitest";



vi.mock("../config/prisma.js", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("../utils/user-utils.js", () => ({
  createHash: vi.fn(),
  isValid: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(() => "mock-jwt-token"),
  },
}));



import { register, login } from "../services/auth.service.js";
import prisma from "../config/prisma.js";
import { createHash, isValid } from "../utils/user-utils.js";
import CustomError from "../utils/custom-error.js";



const MOCK_USER = {
  id: 1,
  name: "Juan Pérez",
  email: "juan@test.com",
  password: "hashed_password_123",
  role: "USER",
  bio: null,
  avatarUrl: null,
};



describe("AuthService › register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createHash.mockResolvedValue("hashed_password_123");
  });

  
  it("registra un nuevo usuario exitosamente", async () => {
    prisma.user.findUnique.mockResolvedValue(null); 
    prisma.user.create.mockResolvedValue(MOCK_USER);

    const result = await register({
      name: "Juan Pérez",
      email: "juan@test.com",
      password: "password123",
    });

    
    expect(prisma.user.findUnique).toHaveBeenCalledOnce();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "juan@test.com" },
    });

    
    expect(createHash).toHaveBeenCalledWith("password123");

    
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "Juan Pérez",
        email: "juan@test.com",
        password: "hashed_password_123",
        role: "USER",
      },
    });

    
    expect(result).toEqual(MOCK_USER);
  });

  
  it("lanza CustomError 409 si el email ya está registrado", async () => {
    prisma.user.findUnique.mockResolvedValue(MOCK_USER); 

    await expect(
      register({
        name: "Otro Usuario",
        email: "juan@test.com",
        password: "otrapass123",
      })
    ).rejects.toMatchObject({
      message: "El email ya esta registrado",
      status: 409,
    });

    
    expect(prisma.user.create).not.toHaveBeenCalled();
    
    expect(createHash).not.toHaveBeenCalled();
  });

  
  it("el error de email duplicado es instancia de CustomError", async () => {
    prisma.user.findUnique.mockResolvedValue(MOCK_USER);

    await expect(
      register({ name: "Test", email: "juan@test.com", password: "pass1234" })
    ).rejects.toBeInstanceOf(CustomError);
  });
});



describe("AuthService › login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  
  it("retorna token y datos del usuario en login exitoso", async () => {
    prisma.user.findUnique.mockResolvedValue(MOCK_USER);
    isValid.mockResolvedValue(true); 

    const result = await login({
      email: "juan@test.com",
      password: "password123",
    });

    
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "juan@test.com" },
    });

    
    expect(isValid).toHaveBeenCalledWith("password123", MOCK_USER.password);

    
    expect(result).toHaveProperty("token", "mock-jwt-token");
    expect(result.user).toEqual({
      id: 1,
      email: "juan@test.com",
      name: "Juan Pérez",
      role: "USER",
    });

    
    expect(result.user).not.toHaveProperty("password");
  });

  
  it("lanza CustomError 401 si el usuario no existe", async () => {
    prisma.user.findUnique.mockResolvedValue(null); 

    await expect(
      login({ email: "noexiste@test.com", password: "cualquier_pass" })
    ).rejects.toMatchObject({
      message: "Credenciales inválidas",
      status: 401,
    });

    
    expect(isValid).not.toHaveBeenCalled();
  });

  
  it("lanza CustomError 401 si la contraseña es incorrecta", async () => {
    prisma.user.findUnique.mockResolvedValue(MOCK_USER);
    isValid.mockResolvedValue(false); 

    await expect(
      login({ email: "juan@test.com", password: "contraseña_equivocada" })
    ).rejects.toMatchObject({
      message: "Credenciales inválidas",
      status: 401,
    });

    
    expect(prisma.user.findUnique).toHaveBeenCalledOnce();
    expect(isValid).toHaveBeenCalledOnce();
  });

  
  it("el mensaje de error es idéntico para usuario inexistente y contraseña incorrecta (sin revelar cuál falló)", async () => {
    
    prisma.user.findUnique.mockResolvedValue(null);
    const errorA = await login({ email: "noexiste@test.com", password: "pass" }).catch((e) => e);

    
    prisma.user.findUnique.mockResolvedValue(MOCK_USER);
    isValid.mockResolvedValue(false);
    const errorB = await login({ email: "juan@test.com", password: "wrongpass" }).catch((e) => e);

    
    expect(errorA.message).toBe(errorB.message);
    expect(errorA.status).toBe(errorB.status);
  });
});

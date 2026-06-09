import { describe, it, expect, vi, beforeEach } from "vitest";

// ─────────────────────────────────────────────────────────────
// Mocks  (vi.mock se hoistea automáticamente antes de los imports)
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// Imports reales (resueltos después del hoisting de los mocks)
// ─────────────────────────────────────────────────────────────

import { register, login } from "../services/auth.service.js";
import prisma from "../config/prisma.js";
import { createHash, isValid } from "../utils/user-utils.js";
import CustomError from "../utils/custom-error.js";

// ─────────────────────────────────────────────────────────────
// Fixture reutilizable
// ─────────────────────────────────────────────────────────────

const MOCK_USER = {
  id: 1,
  name: "Juan Pérez",
  email: "juan@test.com",
  password: "hashed_password_123",
  role: "USER",
  bio: null,
  avatarUrl: null,
};

// ─────────────────────────────────────────────────────────────
// Suite: register
// ─────────────────────────────────────────────────────────────

describe("AuthService › register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createHash.mockResolvedValue("hashed_password_123");
  });

  // Test 1 ──────────────────────────────────────────────────
  it("registra un nuevo usuario exitosamente", async () => {
    prisma.user.findUnique.mockResolvedValue(null); // email disponible
    prisma.user.create.mockResolvedValue(MOCK_USER);

    const result = await register({
      name: "Juan Pérez",
      email: "juan@test.com",
      password: "password123",
    });

    // Verificó que el email no exista
    expect(prisma.user.findUnique).toHaveBeenCalledOnce();
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "juan@test.com" },
    });

    // Hasheó la contraseña antes de guardar
    expect(createHash).toHaveBeenCalledWith("password123");

    // Creó el usuario con role USER (nunca definido desde el body)
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "Juan Pérez",
        email: "juan@test.com",
        password: "hashed_password_123",
        role: "USER",
      },
    });

    // Devuelve el usuario creado
    expect(result).toEqual(MOCK_USER);
  });

  // Test 2 ──────────────────────────────────────────────────
  it("lanza CustomError 409 si el email ya está registrado", async () => {
    prisma.user.findUnique.mockResolvedValue(MOCK_USER); // email ocupado

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

    // No intentó crear nada
    expect(prisma.user.create).not.toHaveBeenCalled();
    // No hasheó la contraseña (fail early)
    expect(createHash).not.toHaveBeenCalled();
  });

  // Test 3 ──────────────────────────────────────────────────
  it("el error de email duplicado es instancia de CustomError", async () => {
    prisma.user.findUnique.mockResolvedValue(MOCK_USER);

    await expect(
      register({ name: "Test", email: "juan@test.com", password: "pass1234" })
    ).rejects.toBeInstanceOf(CustomError);
  });
});

// ─────────────────────────────────────────────────────────────
// Suite: login
// ─────────────────────────────────────────────────────────────

describe("AuthService › login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 4 ──────────────────────────────────────────────────
  it("retorna token y datos del usuario en login exitoso", async () => {
    prisma.user.findUnique.mockResolvedValue(MOCK_USER);
    isValid.mockResolvedValue(true); // contraseña correcta

    const result = await login({
      email: "juan@test.com",
      password: "password123",
    });

    // Buscó el usuario por email
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "juan@test.com" },
    });

    // Comparó la contraseña con el hash almacenado
    expect(isValid).toHaveBeenCalledWith("password123", MOCK_USER.password);

    // Devuelve token + usuario (sin password)
    expect(result).toHaveProperty("token", "mock-jwt-token");
    expect(result.user).toEqual({
      id: 1,
      email: "juan@test.com",
      name: "Juan Pérez",
      role: "USER",
    });

    // No expone la contraseña hasheada
    expect(result.user).not.toHaveProperty("password");
  });

  // Test 5 ──────────────────────────────────────────────────
  it("lanza CustomError 401 si el usuario no existe", async () => {
    prisma.user.findUnique.mockResolvedValue(null); // usuario no encontrado

    await expect(
      login({ email: "noexiste@test.com", password: "cualquier_pass" })
    ).rejects.toMatchObject({
      message: "Credenciales inválidas",
      status: 401,
    });

    // No verificó contraseña (fail early, sin revelar si el email existe)
    expect(isValid).not.toHaveBeenCalled();
  });

  // Test 6 ──────────────────────────────────────────────────
  it("lanza CustomError 401 si la contraseña es incorrecta", async () => {
    prisma.user.findUnique.mockResolvedValue(MOCK_USER);
    isValid.mockResolvedValue(false); // contraseña no coincide

    await expect(
      login({ email: "juan@test.com", password: "contraseña_equivocada" })
    ).rejects.toMatchObject({
      message: "Credenciales inválidas",
      status: 401,
    });

    // Sí buscó el usuario y sí comparó la contraseña
    expect(prisma.user.findUnique).toHaveBeenCalledOnce();
    expect(isValid).toHaveBeenCalledOnce();
  });

  // Test 7 ──────────────────────────────────────────────────
  it("el mensaje de error es idéntico para usuario inexistente y contraseña incorrecta (sin revelar cuál falló)", async () => {
    // Caso A: usuario no existe
    prisma.user.findUnique.mockResolvedValue(null);
    const errorA = await login({ email: "noexiste@test.com", password: "pass" }).catch((e) => e);

    // Caso B: contraseña incorrecta
    prisma.user.findUnique.mockResolvedValue(MOCK_USER);
    isValid.mockResolvedValue(false);
    const errorB = await login({ email: "juan@test.com", password: "wrongpass" }).catch((e) => e);

    // Mismo mensaje → no se filtra si el email existe
    expect(errorA.message).toBe(errorB.message);
    expect(errorA.status).toBe(errorB.status);
  });
});
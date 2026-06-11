import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";

// Mockeamos el servicio de login para no hacer llamadas HTTP reales
vi.mock("../services/auth.services", () => ({
  login: vi.fn(),
}));

import { login as loginService } from "../services/auth.services";

const mockAuthLogin = vi.fn();

const renderLogin = () =>
  render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{ login: mockAuthLogin, user: null, token: null }}
      >
        <Login />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el campo de email", () => {
    renderLogin();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
  });

  it("renderiza el campo de contraseña", () => {
    renderLogin();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it("renderiza el botón de submit", () => {
    renderLogin();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  it("muestra un mensaje de error cuando el login falla", async () => {
    loginService.mockRejectedValueOnce(new Error("Credenciales inválidas"));
    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "wrong-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
    });
  });

  it("llama a authLogin con token y usuario tras un submit exitoso", async () => {
    const fakeUser = { id: 1, name: "Juan Pérez" };
    loginService.mockResolvedValueOnce({
      data: { token: "fake-jwt-token", user: fakeUser },
    });
    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "correct-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockAuthLogin).toHaveBeenCalledWith("fake-jwt-token", fakeUser);
    });
  });
});
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostCard from "../components/PostCard";

// Mockeamos formatRelativeTime para que no dependa del tiempo actual
vi.mock("../utils/dateFormatter", () => ({
  formatRelativeTime: () => "hace 2 días",
}));

const mockPost = {
  id: 1,
  title: "Introducción a React Testing Library",
  excerpt: "Este es el extracto del post de prueba.",
  author: "Juan Pérez",
  authorId: 42,
  authorAvatar: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  categories: [
    { id: 1, name: "React", slug: "react" },
    { id: 2, name: "Testing", slug: "testing" },
  ],
  coverImage: null,
  readTime: 5,
};

const renderPostCard = (props = {}) =>
  render(
    <MemoryRouter>
      <PostCard post={{ ...mockPost, ...props }} />
    </MemoryRouter>
  );

describe("PostCard", () => {
  it("renderiza el título del post", () => {
    renderPostCard();
    expect(
      screen.getByText("Introducción a React Testing Library")
    ).toBeInTheDocument();
  });

  it("renderiza el nombre del autor", () => {
    renderPostCard();
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
  });

  it("renderiza el extracto del post", () => {
    renderPostCard();
    expect(
      screen.getByText("Este es el extracto del post de prueba.")
    ).toBeInTheDocument();
  });

  it("trunca el extracto cuando supera los 150 caracteres", () => {
    const longExcerpt = "Texto largo ".repeat(20); // ~240 caracteres
    renderPostCard({ excerpt: longExcerpt });

    const excerptEl = screen.getByText(/Texto largo.*…$/);
    expect(excerptEl.textContent.length).toBe(151); // 150 chars + "…"
  });

  it("renderiza los badges de categorías del post", () => {
    renderPostCard();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("llama a onClick con el id del post al hacer clic en la card", () => {
    const handleClick = vi.fn();
    render(
      <MemoryRouter>
        <PostCard post={mockPost} onClick={handleClick} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("article"));
    expect(handleClick).toHaveBeenCalledWith(1);
  });
});
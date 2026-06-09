import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,         // describe/it/expect sin importar
    environment: "node",   // no necesitamos jsdom
    coverage: {
      provider: "v8",
      include: ["src/services/**"],
    },
  },
});
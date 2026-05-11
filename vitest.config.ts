import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "tsx-sql/jsx-dev-runtime": new URL("./src/jsx-dev-runtime.ts", import.meta.url).pathname,
      "tsx-sql/jsx-runtime": new URL("./src/jsx-runtime.ts", import.meta.url).pathname,
      "tsx-sql": new URL("./src/index.ts", import.meta.url).pathname
    }
  },
  test: {
    environment: "node",
    globals: true,
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"]
  }
});

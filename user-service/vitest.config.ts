import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "node",
    alias: [
      { find: /^@\/(.*)$/, replacement: resolve(__dirname, "./src/") + "/$1" },
    ],
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(), tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true, // optional: auto-opens browser
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url))
    },
  },
});
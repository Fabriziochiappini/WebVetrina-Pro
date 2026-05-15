import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Cloud-build friendly Vite config.
// Replit-specific plugins removed so the build runs cleanly on Vercel
// (and on any plain CI). Local dev still works.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@":        path.resolve(import.meta.dirname, "client", "src"),
      "@shared":  path.resolve(import.meta.dirname, "shared"),
      "@assets":  path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});

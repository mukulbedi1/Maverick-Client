import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://maverick-server1.onrender.com/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/api/py": {
        target: "http://localhost:5102",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/py/, ""), // Remove /api/py prefix
      },
    },
  },
});

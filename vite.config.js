import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/": `${__dirname}/src/`,   // lets you keep the "@/components/…" imports
    },
  },
});


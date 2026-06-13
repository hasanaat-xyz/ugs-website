import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/widget.js",
      name: "LakePassWidget",
      fileName: "lakepass-widget",
      formats: ["iife"],
    },
    outDir: "dist",
  },
  server: { port: 5175 },
});

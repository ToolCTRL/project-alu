import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: { port: 3000 },
  plugins: [reactRouter(), tsconfigPaths()],
  ssr: {
    // noExternal: ["remix-i18next"],
  },
  resolve: {
    alias: {
      ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem in separate chunk
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/react-router")) {
            return "react-vendor";
          }
          // Radix UI components in separate chunk
          if (id.includes("node_modules/@radix-ui")) {
            return "radix-ui";
          }
          // Monaco Editor in separate chunk (lazy loaded)
          if (id.includes("node_modules/@monaco-editor") || id.includes("node_modules/monaco-editor")) {
            return "monaco";
          }
          // Tiptap Editor in separate chunk (lazy loaded)
          if (id.includes("node_modules/@tiptap")) {
            return "tiptap";
          }
          // Other large vendor libraries
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});

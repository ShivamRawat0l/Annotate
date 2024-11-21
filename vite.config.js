import MillionLint from "@million/lint";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [MillionLint.vite(), react()],
  root: ".",
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"), // Points @ to the src directory
    },
  },
  define: {
    "process.env.IS_PREACT": Bun.env.IS_PREACT,
    "process.env.APPWRITE_PROJECT_ID": `'${Bun.env.APPWRITE_PROJECT_ID}'`,
    "process.env.APPWRITE_DATABASE_ID": `'${Bun.env.APPWRITE_DATABASE_ID}'`,
    "process.env.APPWRITE_NOTES_COLLECTION_ID": `'${Bun.env.APPWRITE_NOTES_COLLECTION_ID}'`,
    "process.env.APPWRITE_USER_COLLECTION_ID": `'${Bun.env.APPWRITE_USER_COLLECTION_ID}'`,
  },
});

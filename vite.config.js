import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	root: ".",
	resolve: {
		alias: {
			"@": resolve(__dirname, "./"), // Points @ to the src directory
		},
	},
	build: {
		chunkSizeWarningLimit: 400,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
				},
			},
		},
	},
	define: {
		"process.env.APPWRITE_PROJECT_ID": `'${Bun.env.APPWRITE_PROJECT_ID}'`,
		"process.env.APPWRITE_DATABASE_ID": `'${Bun.env.APPWRITE_DATABASE_ID}'`,
		"process.env.APPWRITE_NOTES_COLLECTION_ID": `'${Bun.env.APPWRITE_NOTES_COLLECTION_ID}'`,
		"process.env.APPWRITE_USER_COLLECTION_ID": `'${Bun.env.APPWRITE_USER_COLLECTION_ID}'`,
		"process.env.BUN_ENV": `'${Bun.env.BUN_ENV}'`,
	},
});

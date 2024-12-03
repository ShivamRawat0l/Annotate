import MillionLint from "@million/lint";
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
					// Group vendor dependencies into their own chunk
					vendor: ["react", "react-dom"],
					// You can add more manual chunks as needed
				},
			},
		},
	},
	define: {
		"process.env.APPWRITE_PROJECT_ID": `'${Bun.env.APPWRITE_PROJECT_ID}'`,
		"process.env.APPWRITE_DATABASE_ID": `'${Bun.env.APPWRITE_DATABASE_ID}'`,
		"process.env.APPWRITE_NOTES_COLLECTION_ID": `'${Bun.env.APPWRITE_NOTES_COLLECTION_ID}'`,
		"process.env.APPWRITE_USER_COLLECTION_ID": `'${Bun.env.APPWRITE_USER_COLLECTION_ID}'`,
	},
});

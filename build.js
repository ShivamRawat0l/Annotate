import lightningcss from "bun-lightningcss";
import MillionLint from "@million/lint";
import react from "@vitejs/plugin-react";
try {
  await Bun.build({
    entrypoints: ["./index.tsx"],
    outdir: "./dist",
    minify: false,
    loader: {
      ".svg": "file",
      ".css": "css",
      ".png": "file",
    },
    naming: {
      asset: "assets/[name].[ext]",
    },
    define: {
      "process.env.IS_PREACT": Bun.env.IS_PREACT,
      "process.env.APPWRITE_PROJECT_ID": `'${Bun.env.APPWRITE_PROJECT_ID}'`,
      "process.env.APPWRITE_DATABASE_ID": `'${Bun.env.APPWRITE_DATABASE_ID}'`,
      "process.env.APPWRITE_NOTES_COLLECTION_ID": `'${Bun.env.APPWRITE_NOTES_COLLECTION_ID}'`,
      "process.env.APPWRITE_USER_COLLECTION_ID": `'${Bun.env.APPWRITE_USER_COLLECTION_ID}'`,
    },
    plugins: [lightningcss()],
  });
  console.log("Recompiled");
} catch (error) {
  console.error(error);
}

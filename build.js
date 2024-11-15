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
      "process.env.APPWRITE_COLLECTION_ID": `'${Bun.env.APPWRITE_COLLECTION_ID}'`,
    },
  });
  console.log("Recompiled");
} catch (error) {
  console.error(error);
}

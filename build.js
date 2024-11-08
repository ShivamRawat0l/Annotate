await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./dist",
  minify: false,
  loader: {
    ".svg": "file",
    ".css": "css",
  },
  define: {
    "process.env.IS_PREACT": JSON.stringify("true"), // Example environment variable
  },
});
console.log("Recompiled");

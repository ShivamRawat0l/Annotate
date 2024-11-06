await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./dist",
  minify: false,
  loader: {
    ".svg": "file",
  },
  define: {
    "process.env.IS_PREACT": JSON.stringify("true"), // Example environment variable
  },
});
console.log("Recompiled");

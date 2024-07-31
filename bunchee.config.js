module.exports = {
  input: "src/index.tsx",
  output: [
    {
      format: "cjs",
      file: "dist/index.js",
    },
    {
      format: "esm",
      file: "dist/index.mjs",
    },
  ],
  tsconfig: "tsconfig.json",
};

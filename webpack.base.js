/* eslint-disable */
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
    ],
  },
  externals: ['react', 'react-dom'],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".d.ts"],
    alias: {
      '@reactiveforms/core': path.resolve(__dirname, './packages/core/src'),
    }
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
};

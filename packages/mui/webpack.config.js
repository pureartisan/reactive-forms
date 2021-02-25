/* eslint-disable */
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.build.json'
        }
      },
    ],
  },
  externals: {
    react: "react",
    reactDOM: "react-dom",
    '@material-ui/core': "@material-ui/core"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
};

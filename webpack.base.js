/* eslint-disable */
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.build.json'
        }
      },
    ],
  },
  externals: {
    'react': 'commonjs2 react',
    'react-dom': 'commonjs2 react-dom'
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      '@reactiveforms/core': path.resolve(__dirname, './packages/core/src'),
    }
  }
};

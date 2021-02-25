/* eslint-disable */
const path = require('path');
const baseConfig = require('../../webpack.base');

module.exports = {
  ...baseConfig,
  entry: "./src/index.ts",
  output: {
    ...baseConfig.output,
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: 'ReactiveFormsCore',
  }
};

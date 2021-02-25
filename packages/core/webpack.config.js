/* eslint-disable */
const path = require("path");

const baseConfig = require('../../webpack.base');

module.exports = {
  ...baseConfig,
  entry: "./src/index.ts"
};

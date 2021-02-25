/* eslint-disable */
const baseConfig = require('../../webpack.base');

module.exports = {
  ...baseConfig,
  entry: "./src/index.ts",
  externals: [
    ...baseConfig.externals,
    '@reactiveforms/core',
    '@material-ui/core'
  ],
};

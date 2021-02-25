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
    library: 'ReactiveFormsMui',
  },
  externals: {
    ...baseConfig.externals,
    '@material-ui/core': {
      root: 'MaterialUiCore',
      commonjs: '@material-ui/core',
      commonjs2: '@material-ui/core',
      amd: '@material-ui/core',
    },
    '@reactiveforms/core': {
      root: 'ReactiveFormsCore',
      commonjs: '@reactiveforms/core',
      commonjs2: '@reactiveforms/core',
      amd: '@reactiveforms/core',
    }
  }
};

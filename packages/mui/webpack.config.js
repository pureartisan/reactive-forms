/* eslint-disable */
const path = require('path');
const baseConfig = require('../../webpack.base');

module.exports = (env, argv) => {

    const base = baseConfig(env, argv);

    return {
        ...base,
        entry: "./src/index.ts",
        output: {
          ...base.output,
          filename: "index.js",
          path: path.resolve(__dirname, "dist"),
          library: 'ReactiveFormsMui',
        },
        externals: {
          ...base.externals,
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

}

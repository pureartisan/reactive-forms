/* eslint-disable */
const path = require('path');
const baseConfig = require('../../webpack.base');
const webpack = require('webpack');

module.exports = (env, argv) => {

    const base = baseConfig(env, argv);

    return {
        ...base,
        entry: "./src/index.ts",
        plugins: [
          ...base.plugins,
          // `primereact` uses classnames, but we want to use the lite-version `clsx`
          new webpack.NormalModuleReplacementPlugin(/classnames/, 'clsx')
        ],
        output: {
          ...base.output,
          filename: "index.js",
          path: path.resolve(__dirname, "dist"),
          library: 'ReactiveFormsPrime',
        },
        externals: {
          ...base.externals,
          '@reactiveforms/core': {
            root: 'ReactiveFormsCore',
            commonjs: '@reactiveforms/core',
            commonjs2: '@reactiveforms/core',
            amd: '@reactiveforms/core',
          }
        }
    };

}

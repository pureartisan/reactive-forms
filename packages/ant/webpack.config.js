/* eslint-disable */
const path = require("path");
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
          library: 'ReactiveFormsAnt',
        }
    };

}

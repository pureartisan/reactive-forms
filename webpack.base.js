/* eslint-disable */
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';
    const isProd = argv.mode === 'production';

    const config = {
        devtool: 'source-map',
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
            {
              test: /\.(css|scss|sass)$/i,
              use: [
                MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: { sourceMap: true }
                },
                {
                  loader: 'sass-loader',
                  options: { sourceMap: true }
                },
              ],
            },
          ],
        },
        externals: {
          'react': {
            root: 'React',
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
          },
          'react-dom': {
            root: 'ReactDOM',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
          }
        },
        resolve: {
          extensions: [".tsx", ".ts", ".jsx", ".js"]
        },
        output: {
          libraryTarget: 'umd',
          globalObject: 'this'
        },
        plugins: [
          new MiniCssExtractPlugin({
              filename: "styles.min.css"
          })
        ],
        optimization: {
          minimize: true,
          minimizer: [
            `...`,
            new CssMinimizerPlugin(),
          ],
        },
    };

    return config;

};

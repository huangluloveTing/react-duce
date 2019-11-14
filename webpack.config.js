const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

const COMMON_PATH = {
  DIST: path.resolve(__dirname, 'dist')
}

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    path: COMMON_PATH.DIST,
    filename: 'react-dux.min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true
      })
    ],
  }
}
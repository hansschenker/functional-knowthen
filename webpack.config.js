//const merge = require("webpack-merge");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/index.ts",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: true,
      template: path.resolve(__dirname, "src", "index.html"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
}

const webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  context: __dirname,
  mode: "development",
  // Compat must be a separate entry point, to ensure it can execute
  // even when the browser can't parse the main bundle.
  entry: {
    p3: "./src/p3-entry.tsx",
    compat: "./src/compat.tsx"
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".tsx", ".js", ".d.ts"],
    alias: { "react-dom": "react-dom-lite" },
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/build"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.template.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }),
    new HTMLInlineCSSWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      },
      {
        test: /critical\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  }
};
console.log("webpack running:");

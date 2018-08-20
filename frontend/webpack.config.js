const webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

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
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      },
    ]
  }
};
console.log("webpack running:");

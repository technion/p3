const webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin

module.exports = {
  context: __dirname,
  mode: "production",
  // Compat must be a separate entry point, to ensure it can execute
  // even when the browser can't parse the main bundle.
  entry: {
    p3: "./src/p3-entry.tsx",
    compat: "./src/compat.tsx"
  },
  resolve: {
    extensions: [".tsx", ".js", ".d.ts"],
    alias: { "react-dom": "react-dom-lite" },
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "report.html",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.template.html"
    })
  ],
  output: {
    filename: "[name].js",
    path: __dirname + "/build",
  },
  module: {
    rules: [
	    {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      },
    ]
  },
};
console.log("webpack running:");

const webpack = require("webpack");
var BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

module.exports = {
  context: __dirname,
  mode: "production",
  entry: "./src/p3-entry.tsx",
  resolve: {
    extensions: [".tsx", ".js", ".d.ts"],
    alias: { "react-dom": "react-dom-lite" },
  },
  plugins: [ new BundleAnalyzerPlugin({
    analyzerMode: "static",
    reportFilename: "report.html",
    })
  ],
  output: {
    filename: "p3.js",
    path: __dirname + "/build",
  },
  module: {
    rules: [
	    {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
}
console.log("webpack running:");

var path = require("path");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: {
    player: "./src/player.js",
  },
  devtool: "cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "lib"),
    library: "player",
    libraryTarget: "window",
    filename: "[name].js",
    chunkFilename: "chunks/[name].js",
  },
  resolve: {
    symlinks: false,
  },
  module: {
    rules: [],
  },
  plugins: [],
};

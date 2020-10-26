const path = require("path");

module.exports = {
  entry: [
    "./js/util.js",
    "./js/debounce.js",
    "./js/backend.js",
    "./js/pin.js",
    "./js/form.js",
    "./js/card.js",
    "./js/filter.js",
    "./js/map.js",
    "./js/main.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};

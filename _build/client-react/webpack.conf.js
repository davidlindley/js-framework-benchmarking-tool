const webpack = require('webpack'),
  path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  BASE_PATH = path.join(__dirname, '../../src/client-react/');

var config = {
  entry: [
    path.join(BASE_PATH, '/src/app/main.tsx')
  ],
  output: {
    path: path.join(BASE_PATH, '/dist'),
    filename: 'main.js'
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".jsx", ".js", ".html"]
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader!ts-loader?configFileName=./tsconfig-react.json",
        exclude: "/node_modules/"
      },
      {
        test : /\.jsx?/,
        include : path.join(BASE_PATH, 'src'),
        loader : 'babel'
      },
      {
        test: /\.html$/,
        loader: "raw-loader"
      },
      {
        test: /\.rt$/,
        loader: "babel-loader!react-templates-loader?modules=es6"
      }
    ],
    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        test: /\.jsx$/,
        loader: "source-map-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'ReactClient',
      filename: 'index.html',
      template: path.join(BASE_PATH, 'src/index.html')
    })
  ]
};

module.exports = config;

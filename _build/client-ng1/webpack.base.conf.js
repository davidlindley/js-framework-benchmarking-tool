var webpack = require('webpack'),
  path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  PATH_BASE = './src/client-ng1/';

module.exports = {
  watch: true,
  entry: {
    app: PATH_BASE + 'src/app/main.js'
  },
  output: {
    path: PATH_BASE + 'dist/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.js'],
    alias: {
      'src': PATH_BASE + 'src/',
    }
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash:7]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: '/../../src/client-ng1',
      verbose: true,
      dry: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: PATH_BASE + 'src/index.html',
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      mangle: false,
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        screw_ie8: true
      }
    })
  ]
}

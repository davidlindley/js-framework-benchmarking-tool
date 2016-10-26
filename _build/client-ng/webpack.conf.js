var webpack = require('webpack'),
  path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  HtmlWebpackPrefixPlugin = require('html-webpack-prefix-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  helpers = require('./helpers'),
  PATH_BASE = './src/client-ng/';

module.exports = {
  entry: {
    'polyfils'  : path.resolve(PATH_BASE, 'src/polyfils.ts'),
    'vendor'    : path.resolve(PATH_BASE, 'src/vendor.ts'),
    'app'       : path.resolve(PATH_BASE, 'src/main.ts')
  },
  output: {
    filename: '[name].js',
    path    : path.resolve(PATH_BASE, 'dist/')
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader?tsconfig=./tsconfig-ng.json', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: ['app', 'vendor', 'polyfils']
    }),
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: PATH_BASE + 'src/index.html',
        prefix: 'ng/'
    }),
    new HtmlWebpackPrefixPlugin(),
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

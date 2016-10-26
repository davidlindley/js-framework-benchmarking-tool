var path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  PATH_BASE = './src/client-dashboard/',
  WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = {
  watch: true,
  entry: {
    app: PATH_BASE + 'src/app/main.ts'
  },
  output: {
    path: PATH_BASE + 'dist/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.ts'],
    alias: {
      'src': PATH_BASE + 'src/',
      vue: 'vue/dist/vue.js'
    }
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: "html"
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
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
  vue: {
    loaders: {
      js: 'babel'
    }
  },
  ts: {
    experimentalDecorators: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: PATH_BASE + 'src/index.html',
    }),
    new WebpackAutoInject()
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
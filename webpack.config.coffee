path = require 'path'
webpack = require 'webpack'

module.exports =
  entry:
    app: './client/app'
    admin: './client/admin'

  output:
    path: path.join __dirname, 'public'
    filename: '[name].js'
    chunkFilename: '[id].js'

  module:
    loaders: [
      test: /\.jsx?$/
      exclude: /node_modules/
      loader: 'babel'
    ]

  plugins: [
    new webpack.optimize.UglifyJsPlugin
      compress:
        warnings: false
  ]

  devtool: 'source-map'

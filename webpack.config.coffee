path = require 'path'
webpack = require 'webpack'

module.exports =
  entry:
    app: './client/index'
    admin: './client/admin'

  output:
    path: path.join __dirname, 'public'
    filename: '[name].js'

  module:
    loaders: [
      test: /\.jsx?$/
      exclude: /node_modules/
      loader: 'babel'
    ]

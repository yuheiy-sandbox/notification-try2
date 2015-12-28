path = require 'path'
webpack = require 'webpack'

module.exports =
  devtool: 'source-map'
  context: path.join __dirname, 'client'

  entry:
    app: './index'
    admin: './admin'

  output:
    path: path.join __dirname, 'public'
    filename: '[name].js'

  module:
    loaders: [
      test: /\.jsx?$/
      exclude: /node_modules/
      loader: 'babel'
    ]

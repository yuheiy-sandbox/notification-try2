gulp = require 'gulp'
$ = require('gulp-load-plugins')()
webpack = require 'webpack'
webpackConfig = require './webpack.config'

gulp.task 'sass', ->
  gulp.src 'client/styles/style.scss'
    .pipe $.plumber()
    .pipe $.sourcemaps.init loadMaps: true
    .pipe $.sass(
      outputStyle: 'compressed'
      includePaths: ['node_modules/foundation-sites/scss']
    ).on 'error', $.sass.logError
    .pipe $.sourcemaps.write './'
    .pipe gulp.dest 'public'

myDevConfig = Object.create webpackConfig
myDevConfig.debug = true
devCompiler = webpack myDevConfig

gulp.task 'webpack:dev', (cb) ->
  devCompiler.run (err, stats) ->
    if err
      throw new $.util.PluginError 'webpack:dev', err
    $.util.log '[webpack:dev]', stats.toString
      colors: true
    cb()

gulp.task 'webpack:build', (cb) ->
  myConfig = Object.create webpackConfig
  myConfig.plugins ?= []
  myConfig.plugins.push(
    new webpack.optimize.DedupePlugin()
    new webpack.optimize.OccurenceOrderPlugin()
    new webpack.optimize.UglifyJsPlugin
      compress:
        warnings: false
  )

  webpack myConfig, (err, stats) ->
    if err
      throw new $.util.PluginError 'webpack:build', err
    $.util.log '[webpack:build]', stats.toString
      colors: true
    cb()

gulp.task 'watch', ['webpack:dev', 'sass'], ->
  gulp.watch 'client/**/*.js', ['webpack:dev']
  gulp.watch 'client/styles/**/*.scss', ['sass']

gulp.task 'build', ['webpack:build', 'sass']

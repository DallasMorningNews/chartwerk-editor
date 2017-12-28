const gulp = require('gulp');
const webpack = require('webpack');
const prodConfig = require('../../webpack-prod.config.js');
const webpackStream = require('webpack-stream');

module.exports = (cb) =>
  gulp.src('src/js/main.js')
    .pipe(webpackStream(prodConfig, webpack))
    .pipe(gulp.dest('./dist/'))
    .on('end', () => {
      process.exit();
    });

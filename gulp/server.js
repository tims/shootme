'use strict';

var gulp = require('gulp');

var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

var nodemon = require('gulp-nodemon');

function browserSyncInit(baseDir, files, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === 'build' || (util.isArray(baseDir) && baseDir.indexOf('build') !== -1)) {
    routes = {
      // Should be '/bower_components': '../bower_components'
      // Waiting for https://github.com/shakyShane/browser-sync/issues/308
      //'/bower_components': 'bower_components',
      '/assets': 'assets'
    };
  }

  browserSync.instance = browserSync.init(files, {
    startPath: '/',
    server: {
      baseDir: baseDir,
      middleware: middleware,
      routes: routes
    },
    browser: browser
  });

}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    'build'
  ], [
    'build/*.html',
    'build/**/*.css',
    'build/**/*.html',
    'build/**/*.js'
  ]);
});

gulp.task('serve:e2e', function () {
  browserSyncInit(['build'], null, []);
});

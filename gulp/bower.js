'use strict';

var gulp = require('gulp');
var bower = require('gulp-bower');
var size = require('gulp-size');

gulp.task('bower', function() {
  return bower('bower_components')
    .pipe(gulp.dest('build/bower_components'))
    .pipe(size());
});

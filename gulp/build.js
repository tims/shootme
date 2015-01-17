'use strict';

var gulp = require('gulp');
var react = require('gulp-react');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var filter = require('gulp-filter');
var size = require('gulp-size');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('styles', function () {
  return gulp.src('app/**/*.scss')
    .pipe(sass())
    .on('error', handleError)
    .pipe(gulp.dest('build'))
    .pipe(size());
});

gulp.task('jsx', function () {
  gulp.src('app/**/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('build'))
});

gulp.task('scripts', ['jsx'], function () {
  return gulp.src('app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(size())
    .pipe(gulp.dest('build'));
});

gulp.task('partials', function () {
  return gulp.src('app/partials/**')
    .pipe(gulp.dest('build/partials'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('build/images'));
});

gulp.task('misc', function () {
  return gulp.src('app/**/*.ico')
    .pipe(gulp.dest('build'));
});


gulp.task('wiredep', ['bower', 'partials', 'scripts', 'styles'], function () {
  var scripts = gulp.src('scripts/**/*.js', {cwd: 'build'});
  var styles = gulp.src('styles/**/*.css', {cwd: 'build'});

  return gulp.src('app/*.html')
    .pipe(wiredep({
      directory: 'build/bower_components',
      ignorePath: '../build/'
    }))
    .pipe(inject(scripts, {addRootSlash: false}))
    .pipe(inject(styles, {addRootSlash: false}))
    .pipe(gulp.dest('build'));
});

gulp.task('build', ['images', 'misc', 'wiredep']);

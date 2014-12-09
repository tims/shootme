'use strict';

var gulp = require('gulp');
var del= require('del');

require('require-dir')('./gulp');

gulp.task('clean', function (done) {
  del(['.tmp', 'build', 'dist'], done);
});

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

'use strict';

var gulp = require('gulp');

gulp.task('watch', ['build'] ,function () {
  gulp.watch('app/partials/**', ['partials']);
  gulp.watch('app/styles/**', ['styles']);
  gulp.watch(['app/scripts/**','app/app.js'], ['scripts']);
  gulp.watch('bower.json', ['wiredep']);
  gulp.watch('app/*.html', ['wiredep']);
});

var gulp = require('gulp');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var $ = require('gulp-load-plugins')();

gulp.task('dist-useref', ['build'], function () {
  var htmlFilter = filter('*.html');
  var jsFilter = filter('**/*.js');
  var cssFilter = filter('**/*.css');
  var assets;

  return gulp.src('build/*.html')
    .pipe(assets = useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('dist-partials', ['build'], function () {
  gulp.src('build/partials/**.html').pipe(gulp.dest('dist/partials'));
});

gulp.task('dist-all', ['dist-useref', 'dist-partials'])

gulp.task('dist', ['clean'], function () {
  gulp.start('dist-all');
});

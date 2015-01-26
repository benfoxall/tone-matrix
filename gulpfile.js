var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var serve = require('gulp-serve');
var connectlr = require('connect-livereload')();
var livereload = require('gulp-livereload');


gulp.task('js', function() {
  gulp.src('src/*.js')
  .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('build'))
  .pipe(livereload());
});

// don't actually do anything, but notify LR
gulp.task('html', function() {
  gulp.src('*.html')
    .pipe(livereload());
})


gulp.task('default', function(){
  livereload.listen();
  gulp.watch('src/*.js', ['js']);
  gulp.watch('*.html',   ['html']);

  serve({
    root:__dirname,
    middleware: connectlr
  })()
})

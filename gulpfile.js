var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var serve = require('gulp-serve');
var connectlr = require('connect-livereload')();
var livereload = require('gulp-livereload');
var notify = require("gulp-notify");
var less = require('gulp-less');


gulp.task('js', function() {
  gulp.src('src/*.js')
  .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .on('error', notify.onError({title:"js build error"}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('build'))
  .pipe(livereload());
});


gulp.task('css', function() {
  gulp.src('./src/style.less')
  .pipe(sourcemaps.init())
  .pipe(less())
  .on('error', notify.onError({title:"css build error"}))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('build'))
  .pipe(livereload());
});


// don't actually do anything, but notify LR
gulp.task('html', function() {
  gulp.src('*.html')
    .pipe(livereload());
})


gulp.task('default', ['js', 'css'], function(){
  livereload.listen();
  gulp.watch('src/*.js', ['js']);
  gulp.watch('src/*.less', ['css']);
  gulp.watch('*.html',   ['html']);

  serve({
    root:__dirname,
    middleware: connectlr
  })()
})

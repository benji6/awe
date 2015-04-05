var autoprefixer = require('gulp-autoprefixer');
var babel = require("gulp-babel");
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var uglify = require("gulp-uglify");
var watchify = require('watchify');

gulp.task("js", function () {
  var bundler = watchify(browserify('./js/main.js', watchify.args));

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function () {
  gulp.src('sass/style.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist'));
});

gulp.task("watch", function () {
  gulp.start('sass', 'js');
  gulp.watch('sass/style.scss', ["sass"]);
  gulp.watch('js/**/*.js', ["js"]);
});

gulp.task("build", ["js", "sass"]);

gulp.task("default", ["watch"]);

var autoprefixer = require('gulp-autoprefixer');
var babel = require("gulp-babel");
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require("gulp-uglify");
var watchify = require('watchify');

gulp.task("jsDev", function () {
  var bundler = watchify(browserify('./js/main.js', watchify.args));

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source("bundle.js"))
    .pipe(plumber())
    .pipe(buffer())
    // .pipe(sourcemaps.init())
    // .pipe(babel())
    // .pipe(uglify())
    // .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist'));
});

gulp.task("jsDist", function () {
  var bundler = watchify(browserify('./js/main.js', watchify.args));

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source("bundle.js"))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(babel())
    .pipe(uglify())
    .pipe(plumber.stop())
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
  gulp.start("sass", "jsDev");
  gulp.watch('sass/style.scss', ["sass"]);
  gulp.watch('js/**/*.js', ["jsDev"]);
});

gulp.task("build", ["jsDist", "sass"]);

gulp.task("default", ["watch"]);

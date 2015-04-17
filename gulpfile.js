var autoprefixer = require('gulp-autoprefixer');
var babel = require("gulp-babel");
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require("gulp-uglify");
var watchify = require('watchify');

gulp.task("html", function () {
  gulp.src('./index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./dist/'));
});

gulp.task("jsDev", function () {
  var bundler = watchify(browserify('./js/main.js', watchify.args));

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source("bundle.js"))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
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
      browsers: [
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Opera versions'
      ],
      cascade: false
    }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist'));
});

gulp.task("watch", function () {
  gulp.start("html", "jsDev", "sass");
  gulp.watch('index.html', ["html"]);
  gulp.watch('js/**/*.js', ["jsDev"]);
  gulp.watch('sass/style.scss', ["sass"]);
});

gulp.task("build", ["html", "jsDist", "sass"]);

gulp.task("default", ["watch"]);

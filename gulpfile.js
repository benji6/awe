const autoprefixer = require('gulp-autoprefixer');
const babel = require("gulp-babel");
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const gutil = require('gulp-util');
const minifycss = require('gulp-minify-css');
const minifyHTML = require('gulp-minify-html');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require("gulp-uglify");
const watchify = require('watchify');

gulp.task("html", function () {
  gulp.src('./index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./dist/'));
});

gulp.task("jsDev", function () {
  const bundler = watchify(browserify('./js/main.js', watchify.args));

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
  const bundler = watchify(browserify('./js/main.js', watchify.args));

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

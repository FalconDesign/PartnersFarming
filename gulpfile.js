'use strict'

const gulp          = require('gulp'),
      sass          = require('gulp-sass'),
      autoprefixer  = require('gulp-autoprefixer'),
      cleanCSS      = require('gulp-clean-css'),
      minifyJS      = require('gulp-minify'),
      babel         = require('gulp-babel'),
      jade          = require('gulp-jade'),
      imagemin      = require('gulp-imagemin');

// SASS!! We need it to covert sass to css
gulp.task('sass', () => {
    return gulp.src('dev-app/sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dev-app/css'));
});

// This is needed to compress css
gulp.task('minify-css', () => {
   gulp.src('dev-app/css/dist/app.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('ready-for-hosting/styles'))

    gulp.src('dev-app/css/dist/critical.css')
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(gulp.dest('ready-for-hosting/styles'));
});


// This task we need to make our css Cross browser!
gulp.task('autoprefixer', () => {
  gulp.src('dev-app/css/app.css')
      .pipe(autoprefixer({
          browsers: ['last 15 versions'],
          cascade: false
      }))
      .pipe(gulp.dest('dev-app/css/dist'))

// Critical css
  gulp.src('dev-app/css/critical.css')
      .pipe(autoprefixer({
          browsers: ['last 15 versions'],
          cascade: false
      }))
      .pipe(gulp.dest('dev-app/css/dist'))
});

// Babel is needed to convert es6 to es5

gulp.task('es6', () => {
    return gulp.src('dev-app/js/function.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dev-app/js/dist'));
});

// Js compression for smallest JavaScript file size

gulp.task('compress', () => {
  gulp.src('dev-app/js/dist/function.js')
    .pipe(minifyJS({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('ready-for-hosting/scripts'))
});


// Jade is being used to speed up html template building

gulp.task('templates', () => {
  let YOUR_LOCALS = {};

  gulp.src('dev-app/jade/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('ready-for-hosting'))
});

// Getting the smallerst img size

gulp.task('img-compress', () =>
    gulp.src('dev-app/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('ready-for-hosting/images'))
);


// Default tasks

gulp.task('default', ['sass', 'autoprefixer', 'minify-css', 'es6', 'compress', 'templates', 'img-compress']);

/* Watch! This task is important for us of ability
to not press 'gulp'  after every code change! */

gulp.task('watch', () => {
  gulp.watch('dev-app/sass/*.sass', ['sass']);
  gulp.watch('dev-app/css/*.css', ['autoprefixer']);
  gulp.watch('dev-app/css/dist/*.css', ['minify-css']);
  gulp.watch('dev-app/js/function.js', ['es6']);
  gulp.watch('dev-app/js/dist/function.js', ['compress']);
  gulp.watch('dev-app/jade/*.jade', ['templates']);
  gulp.watch('dev-app/jade/section/*.jade', ['templates']);
  gulp.watch('dev-app/img/*', ['img-compress']);
});

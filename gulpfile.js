var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');

var frontendJS = 'app/assets/js/*.js';

gulp.task('sass', function() {
  var src = 'app/assets/scss/tinyquestion.scss';
  var dest = 'public/css';
  var options = {
    includePaths: [ 'app/assets/scss' ]
  };
  gulp.src(src).pipe(plumber()).pipe(sass(options)).pipe(gulp.dest(dest));
});

gulp.task('lint', function() {
  var src = [
    'app/assets/js/*.js',
    'app/*.js',
    '*.js'
  ];
  gulp.src(src).pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js', function() {
  var src = frontendJS;
  var filename = 'tinyquestion.js';
  var dest = 'public/js';
  gulp.src(src).pipe(concat(filename)).pipe(uglify()).pipe(gulp.dest(dest));
});

gulp.task('build', function() {
  gulp.run('sass', 'js');
});

gulp.task('default', function() {
  gulp.run('build');

  gulp.watch([
    '*.js',
    'app/**/*.js'
  ], function() {
    gulp.run('lint');
  });

  gulp.watch(frontendJS, function() {
    gulp.run('js');
  });

  gulp.watch('app/assets/scss/**/*.scss', function() {
    gulp.run('sass');
  });
});



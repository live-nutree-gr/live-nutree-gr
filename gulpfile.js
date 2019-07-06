// Gulp
var gulp = require('gulp');

var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var rename = require("gulp-rename");
var cssnano = require('gulp-cssnano');

// Images
//var svgmin = require('gulp-svgmin');
//var imagemin = require('gulp-imagemin');

// compile all your Sass
gulp.task('sass', function (){
  gulp.src(['scss/*.scss'])
    .pipe(sass({
      includePaths: ['scss'],
      outputStyle: 'expanded'
    }))
    .pipe(prefix(
      "last 10 version"
      ))
    .pipe(gulp.dest('css'))
    .pipe(cssnano());
});

gulp.task('minify', function() {
    return gulp.src(['css/main.css'])
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('css'));
});

// // Images
//   gulp.task('svgmin', function() {
//     gulp.src('./dev/img/svg/*.svg')
//     .pipe(svgmin())
//     .pipe(gulp.dest('./dev/img/svg'))
//     .pipe(gulp.dest('./prod/img/svg'));
//   });
//
//   gulp.task('imagemin', function () {
//     gulp.src('./dev/img/**/*')
//     .pipe(imagemin())
//     .pipe(gulp.dest('./dev/img'))
//     .pipe(gulp.dest('./prod/img'));
//   });

gulp.task('default', function(){

  // watch scss changes
  gulp.watch("scss/**/*.scss", function(event){
    gulp.run('sass');
  });

  gulp.run('minify');

  // // images
  // gulp.watch("./dev/img/**/*", function(event){
  //   gulp.run('imagemin');
  //   gulp.run('svgmin');
  // });
});

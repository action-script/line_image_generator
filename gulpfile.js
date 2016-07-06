var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('default', function() {
   return gulp.src('js/main.js')
      .pipe(webpack({
         output: {
            filename: "lig.js"
         }
      }))
      .pipe(gulp.dest('build/'));
});

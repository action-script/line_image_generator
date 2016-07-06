var gulp = require('gulp');
var webpack = require('webpack-stream');

var libraryName = 'Lig';
var outputFile = 'lig.js';

gulp.task('default', function() {
   return gulp.src('js/main.js')
      .pipe(webpack({
         output: {
            filename: outputFile,
            library: libraryName,
            libraryTarget: 'umd',
            umdNamedDefine: true
         }
      }))
      .pipe(gulp.dest('build/'));
});

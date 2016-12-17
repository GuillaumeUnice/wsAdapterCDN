var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('javascript', function() {
  return gulp.src('dist/**/*.js')
      .pipe(concat('all.js'))
    .pipe(gulp.dest('res'));
});

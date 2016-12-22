var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('javascript', function() {
  return gulp.src(['dist/WsJmsLib.js', 'dist/kaazing-enterprise-client/WebSocket.js', 'dist/kaazing-enterprise-client/JmsClient.js'])
      .pipe(concat('all.js'))
    .pipe(gulp.dest('res'));
});

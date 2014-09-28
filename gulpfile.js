var gulp = require('gulp');

gulp.task('default', ['watch']);
  gulp.task('watch', ['test'], require('./tasks/watch'));
    gulp.task('test', ['build'], require('./tasks/test'));
      gulp.task('build', ['ts']);
        gulp.task('ts', ['clean', 'copy'], require('./tasks/typescript'));
          gulp.task('clean', require('./tasks/clean'));
          gulp.task('copy', require('./tasks/copy'));

gulp.task('dist', ['browserify', 'stripboms']);
  gulp.task('browserify', ['build'], require('./tasks/browserify'));
  gulp.task('stripboms', require('./tasks/stripboms'));

gulp.task('d.ts', require('./tasks/d.ts'));

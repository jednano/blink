var gulp = require('gulp');

gulp.task('default', ['watch']);
  gulp.task('watch', ['test'], require('./tasks/watch'));
    gulp.task('test', ['build'], require('./tasks/test'));
      gulp.task('build', ['scripts']);
        gulp.task('scripts', ['clean', 'copy', 'tslint'], require('./tasks/scripts'));
          gulp.task('clean', require('./tasks/clean'));
          gulp.task('copy', require('./tasks/copy'));
          gulp.task('tslint', require('./tasks/tslint'));

gulp.task('test:onScriptsChanged', ['scripts:changed'], require('./tasks/test'));
  gulp.task('scripts:changed', require('./tasks/scripts'));

gulp.task('dist', ['stripboms', 'browserify']);
  gulp.task('stripboms', require('./tasks/stripboms'));
  gulp.task('browserify', ['build'], require('./tasks/browserify'));

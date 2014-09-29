var gulp = require('gulp');

function watch() {
	gulp.watch([
		'lib/**/*.ts',
		'test/**/*.ts'
	], ['test:onScriptsChanged']);
	gulp.watch([
		'test/fixtures/*.js',
		'test/expected/*.css'
	], require('./test'));
}

module.exports = watch;

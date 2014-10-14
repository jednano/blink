var gulp = require('gulp');

function watch() {
	gulp.watch([
		'lib/**/*.ts',
		'test/**/*.ts'
	], ['test:onScriptsChanged']);
	gulp.watch([
		'test/fixtures/*.js',
		'test/expected/*.css'
	], require('./test--watch'));
}

module.exports = watch;

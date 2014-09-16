var gulp = require('gulp');

function watch() {
	gulp.watch([
		['lib/**/*.ts'],
		['test/spec/**/*.ts'],
		['test/fixtures/*.js'],
		['test/expected/*.css']
	], ['test']);
}

module.exports = watch;

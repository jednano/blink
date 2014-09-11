var gulp = require('gulp');

function watch() {
	gulp.watch([
		['lib/**/*.ts'],
		['test/fixtures/*.ts'],
		['test/spec/**/*.ts']
	], ['test']);
}

module.exports = watch;

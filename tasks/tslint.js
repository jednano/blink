var gulp = require('gulp');
var tslint = require('gulp-tslint');

function mytslint() {
	return gulp.src([
			'lib/**/*.ts',
			'test/spec/**/*.ts'
		])
		.pipe(tslint())
		.pipe(tslint.report('prose', {
			emitError: false
		}));
}

module.exports = mytslint;

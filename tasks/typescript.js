var gulp = require('gulp');
var tsc = require('gulp-tsc');

function typescript() {
	return gulp.src(['test/spec/**/*.ts'])
		.pipe(tsc({ target: 'es5' }))
		.pipe(gulp.dest('js'));
}

module.exports = typescript;

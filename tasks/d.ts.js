var gulp = require('gulp');
var tsc = require('gulp-tsc');

function dts() {
	return gulp.src(['lib/**/*.ts'])
		.pipe(tsc({
			target: 'es5',
			declaration: true
		}))
		.pipe(gulp.dest('d.ts'));
}

module.exports = dts;

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

var gutil = require('gulp-util');

function test() {
	return gulp.src('js/lib/**/*.js')
		.pipe(istanbul())
		.on('finish', function() {
			gulp.src(['js/test/*.js', 'js/test/spec/**/*.js'])
				.pipe(mocha({
					reporter: 'spec',
					clearRequireCache: true
				}))
				.pipe(istanbul.writeReports({
					reporters: ['lcov']
				}));
		});
}

module.exports = test;

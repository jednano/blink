var gulp = require('gulp');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');

function test() {
	return gulp.src(['js/test/*.js', 'js/test/spec/**/*.js'], { read: false })
		.pipe(plumber())
		.pipe(mocha({
			reporter: 'min',
			clearRequireCache: true
		}));
}

module.exports = test;

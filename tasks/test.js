var gulp = require('gulp');
var mocha = require('gulp-mocha');

function test() {
	return gulp.src([
			'js/test/*.js',
			'js/test/spec/**/*.js'
		], {
			read: false
		})
		.pipe(mocha({
			reporter: 'spec',
			clearRequireCache: true
		}));
}

module.exports = test;

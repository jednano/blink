var gulp = require('gulp');
var del = require('del');

function clean() {
	gulp.task('clean', function(done) {
		del(['js', 'd.ts', 'dist'], done);
	});
}

module.exports = clean;

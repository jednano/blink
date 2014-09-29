var gulp = require('gulp');
var del = require('del');

function clean() {
	gulp.task('clean', function(done) {
		del(['js', 'dist'], done);
	});
}

module.exports = clean;

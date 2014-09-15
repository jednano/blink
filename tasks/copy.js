var gulp = require('gulp');

function copy() {
	gulp.task('copy', ['clean'], function() {
		return gulp.src('defaults*.json')
			.pipe(gulp.dest('js'));
	});
}

module.exports = copy;

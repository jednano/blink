var gulp = require('gulp');

function stripboms() {
	return gulp.src('tasks/*.js')
		.pipe(gulp.dest('tasks'));
}

module.exports = stripboms;

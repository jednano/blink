var gulp = require('gulp');
var browserify = require('browserify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

function browserifyTask() {
	var bundleStream = browserify({
		entries: ['./js/lib/blinkBrowser.js'],
		standalone: 'blink'
	}).bundle();

	return bundleStream
		.pipe(source('blink.js'))
		.pipe(gulp.dest('dist'))
		.pipe(streamify(uglify()))
		.pipe(rename('blink.min.js'))
		.pipe(gulp.dest('dist'));
}

module.exports = browserifyTask;

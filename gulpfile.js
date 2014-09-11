var gulp = require('gulp');

var browserify = require('browserify');
var del = require('del');
var fs = require('fs');
var tsc = require('gulp-tsc');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

var paths = {
	lib: {
		ts: ['lib/**/*.ts'],
		js: ['lib/**/*.js']
	},
	test: {
		fixtures: {
			ts: ['test/fixtures/*.ts'],
			js: ['js/test/fixtures/*.js'],
			css: ['js/test/fixtures/*.css']
		},
		spec: {
			ts: ['test/spec/**/*.ts'],
			js: ['js/test/*.js', 'js/test/spec/**/*.js']
		}
	}
};

gulp.task('clean', function(done) {
	del(['js', 'd.ts', 'dist'], done);
});

gulp.task('copy', ['clean'], function() {
	return gulp.src('defaults.json')
		.pipe(gulp.dest('js'));
});

gulp.task('build', ['ts']);

gulp.task('ts', ['clean', 'typescript']);

gulp.task('typescript', function() {
	return gulp.src(paths.test.spec.ts)
		.pipe(tsc({ target: 'es5' }))
		.pipe(gulp.dest('js'));
});

gulp.task('d.ts', function() {
	return gulp.src(paths.lib.ts)
		.pipe(tsc({
			target: 'es5',
			declaration: true
		}))
		.pipe(gulp.dest('d.ts'));
});

gulp.task('test', ['copy', 'ts'], function() {
	return gulp.src(paths.test.spec.js, { read: false })
		.pipe(mocha({
			reporter: 'spec',
			clearRequireCache: true
		}));
});

gulp.task('watch', ['test'], function() {
	gulp.watch([
		paths.lib.ts,
		paths.test.fixtures.ts,
		paths.test.spec.ts
	], ['test']);
});

gulp.task('browserify', ['copy', 'ts'], function() {
	var bundleStream = browserify({
		entries: ['./js/lib/blink.js'],
		standalone: 'blink'
	}).bundle();

	return bundleStream
		.pipe(source('blink.js'))
		.pipe(gulp.dest('dist'))
		.pipe(streamify(uglify()))
		.pipe(rename('blink.min.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('dist', ['browserify']);

gulp.task('default', ['watch']);

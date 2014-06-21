var gulp = require('gulp');
var gutil = require('gulp-util');

var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var fs = require('fs');
var tsc = require('gulp-tsc');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
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

gulp.task('clean', function() {
	return gulp.src(['js', 'd.ts', 'dist'], { read: false })
		.pipe(clean());
});

gulp.task('copy', ['clean'], function(done) {
	fs.mkdir('js', function() {
		copyFile('defaults.json', 'js/defaults.json', done);
	});
});

gulp.task('ts', ['clean', 'ts']);

gulp.task('ts', function() {
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
	return gulp.src('js/lib/blink.js')
		.pipe(browserify())
		.pipe(gulp.dest('dist'));
});

gulp.task('compress', ['browserify'], function() {
	return gulp.src('dist/blink.js')
		.pipe(uglify())
		.pipe(rename('blink.min.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('dist', ['compress']);

gulp.task('default', ['watch']);

function copyFile(source, target, cb) {
	var cbCalled = false;

	var rd = fs.createReadStream(source);
	rd.on('error', done);

	var wr = fs.createWriteStream(target);
	wr.on('error', done);
	wr.on('close', function() {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if (!cbCalled) {
			cb(err);
			cbCalled = true;
		}
	}
}

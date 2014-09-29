var gulp = require('gulp');
var ts = require('gulp-typescript');

var project = ts.createProject({
	target: 'es5',
	module: 'commonjs',
	declarationFiles: true,
	noExternalResolve: true
});

function scripts() {
	var result = gulp.src([
			'bower_components/**/*.d.ts',
			'lib/**/*.ts',
			'test/**/*.ts'
		], {
			base: '.'
		})
		.pipe(ts(project));

	result.dts.pipe(gulp.dest('dist/d.ts'));
	return result.js.pipe(gulp.dest('js'));
}

module.exports = scripts;

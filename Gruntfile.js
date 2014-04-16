module.exports = function(grunt) {

	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			files: [
				'lib/**/*.js',
				'!lib/api.js',
				'test/**/*.js'
			]
		},
		typescript: {
			options: {
				module: 'commonjs',
				target: 'es5'
			},
			test: {
				src: 'test/**/*.ts',
				dest: ''
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					clearRequireCache: true
				},
				src: 'test/**/*.spec.js'
			}
		},
		watch: {
			ts: {
				files: [
					'lib/**/*.ts',
					'test/**/*.ts'
				],
				tasks: ['typescript']
			},
			js: {
				files: [
					'lib/**/*.js',
					'test/**/*.js'
				],
				tasks: ['mochaTest']
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['build', 'mochaTest', 'watch']);
	grunt.registerTask('test', ['build', 'mochaTest', 'clean']);
	grunt.registerTask('build', ['clean', 'typescript']);

};

///<reference path="../bower_components/dt-node/node.d.ts"/>
//var blink = require('./Blink');
var clc = require('cli-color');
var program = require('gitlike-cli');


export function execute(args): number {
	return program
		.version(require('../package.json').version)

		.command('compile <globs>...')
			.description('Compile Blink stylesheets to CSS')
			.action(compile)

			//// Configuration
			//.option('-p, --project <dir>', 'The current directory if not specified', './')
			//.option('-c, --config <path>', 'Specifly location of config file', '.blink')
			//.option('--env <target>',      clc.cyan('dev') + ', prod')

			//.option('--sourcemap', 'Generate a sourcemap')
			//.option('-q, --quiet', 'Quiet mode')
			//.option('-t, --trace', 'Show a full stacktrace on error')
			//.option('-f, --force', 'Overwrites existing files')
			//.option('--dry-run',   'Tells you what it plans to do')
			//.option('--boring',    'Turn off colorized output')

			//// Application settings
			//.option('--app <dir>',               'Base directory for your application')
			//.option('--blink <dir>',             'Blink stylesheet source directory')
			//.option('--css <dir>',               'Target directory for generated CSS files')
			//.option('--images <dir>',            'Directory where you keep your images')
			//.option('--generated-images <path>', 'The path where you generate your images')
			//.option('--fonts <dir>',             'Directory where you keep your fonts')
			//.option('--http <path>',             'Set to the root of your project when deployed')
			//.option('--relative-assets',         'Asset helpers generate relative URLs')

			// Formatting
			.option('-s, --style <style>',          clc.cyan('nested') + ', expanded, compact, compressed', 'nested')
			.option('-i, --one-indent <oneIndent>', clc.cyan('2s') + ', 4s, 1t', '2s')
			.option('-n, --newline <newline>',      clc.cyan('os') + ', lf, crlf', 'os')
			.option('--quote <type>',               clc.cyan('double') + ', single', 'double')

			// BEM support
			.option('-b, --block <format>',    'BEM block format: ' + clc.cyan('.%s'), '.%s')
			.option('-e, --element <format>',  'BEM element format: ' + clc.cyan('__%s'), '__%s')
			.option('-m, --modifier <format>', 'BEM modifier format: ' + clc.cyan('--%s'), '--%s')

			// Browser support
			.option('--chrome <version>',  'Minimum Chrome version supported: ' + clc.cyan('31'), 31)
			.option('--firefox <version>', 'Minimum FF version supported: ' + clc.cyan('27'), 27)
			.option('--ie <version>',      'Minimum IE version supported: ' + clc.cyan('8'), 8)
			.option('--opera <version>',   'Minimum Opera version supported: ' + clc.cyan('20'), 20)

			.on('help', cmd => {
				cmd.outputIndented('Examples', [
					'$ ' + clc.cyan('blink compile "app/styles/**/*.js"'),
					'$ blink compile ' + clc.cyan('--style expanded --ie 7') + ' "app/styles/**/*.js"'
				]);
			}).parent

		.parse(args);
}

function compile(args, options) {
	console.log('args:', args);
	console.log('options:', options);
}

///<reference path="../bower_components/dt-node/node.d.ts" />
var extend = require('node.extend');
import fs = require('fs');

import _Block = require('./Block');
import _Compiler = require('./Compiler');
import _Element = require('./Element');
import _helpers = require('./helpers');
import _IBlockDeclarations = require('./interfaces/IBlockDeclarations');
import _IConfigurationOptions = require('./interfaces/IConfigurationOptions');
import _IDeclarationTree = require('./interfaces/IDeclarationTree');
import _IElementDeclarations = require('./interfaces/IElementDeclarations');
import _IModifierDeclarations = require('./interfaces/IModifierDeclarations');
import _Modifier = require('./Modifier');
import _Rule = require('./Rule');
import Configuration = require('./Configuration');


module Blink {

	export var config = new Configuration();

	export interface IConfigurationOptions extends _IConfigurationOptions {
	}

	export class Compiler extends _Compiler {
	}

	export function compile(options: IConfigurationOptions, files: string[],
		callback: (exitCode: number) => void) {

		var tempConfig = new Configuration(config.raw);
		tempConfig.set(options);
		var compiler = new Compiler(tempConfig);

		compiler.compile(files, (err, results) => {
			if (err) {
				throw err;
			}
			var count = results.length;
			results.forEach(result => {
				fs.writeFile(result.dest, result.contents, (err2) => {
					if (err2) {
						throw err2;
					}
					if (--count === 0) {
						callback(0);
					}
				});
			});
		});
	}

	export interface IDeclarationTree extends _IDeclarationTree {
	}

	export class Rule extends _Rule {
	}

	export class Block extends _Block {
	}

	export interface IBlockDeclarations extends _IBlockDeclarations {
	}

	export class Element extends _Element {
	}

	export interface IElementDeclarations extends _IElementDeclarations {
	}

	export class Modifier extends _Modifier {
	}

	export interface IModifierDeclarations extends _IModifierDeclarations {
	}

	export var helpers = _helpers;

}

export = Blink;

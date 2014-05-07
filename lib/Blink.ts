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
import ICompiledResult = require('./interfaces/ICompiledResult');


module Blink {

	export var config = new Configuration();

	export interface IConfigurationOptions extends _IConfigurationOptions {
	}

	export class Compiler extends _Compiler {
	}

	export function compile(options: IConfigurationOptions, sources: any[],
		callback?: (err: Error, config: Configuration, result: ICompiledResult) => void) {

		var tempConfig = new Configuration(extend({}, config.raw, options));
		var compiler = new Compiler(tempConfig);
		compiler.compile(sources, (err, result) => {
			callback(err, tempConfig, result);
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

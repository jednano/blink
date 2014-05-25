///<reference path="../bower_components/dt-node/node.d.ts" />
import fs = require('fs');

import _Block = require('./Block');
import _Compiler = require('./Compiler');
import _Element = require('./Element');
import _IBlockDeclarations = require('./interfaces/IBlockDeclarations');
import _IConfigurationOptions = require('./interfaces/IConfigurationOptions');
import _IElementDeclarations = require('./interfaces/IElementDeclarations');
import _IModifierDeclarations = require('./interfaces/IModifierDeclarations');
import _IRuleBody = require('./interfaces/IRuleBody');
import _Modifier = require('./Modifier');
import _Rule = require('./Rule');
import Configuration = require('./Configuration');
import ICompiledResult = require('./interfaces/ICompiledResult');


module Blink {

	export var config = new Configuration();

	export function compile(options: IConfigurationOptions, sources: any[],
		callback?: (err: Error, config: Configuration, result: ICompiledResult) => void) {

		var tempConfig = config.clone().set(options);
		var compiler = new Compiler(tempConfig);
		compiler.compile(sources, (err, result) => {
			callback(err, tempConfig, result);
		});
	}

	export class Compiler extends _Compiler {}
	export class Rule     extends _Rule {}
	export class Block    extends _Block {}
	export class Element  extends _Element {}
	export class Modifier extends _Modifier {}

	export interface IConfigurationOptions extends _IConfigurationOptions {}
	export interface IBlockDeclarations    extends _IBlockDeclarations {}
	export interface IElementDeclarations  extends _IElementDeclarations {}
	export interface IModifierDeclarations extends _IModifierDeclarations {}
	export interface IRuleBody             extends _IRuleBody {}

}

export = Blink;

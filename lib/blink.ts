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
import _MediaAtRule = require('./MediaAtRule');
import _Modifier = require('./Modifier');
import _Rule = require('./Rule');
import Configuration = require('./Configuration');
import IFile = require('./interfaces/IFile');


module Blink {

	export var config = new Configuration();

	export function compile(options: IConfigurationOptions, sources: any[],
		callback?: (err: Error, config: Configuration, file: IFile) => void) {

		var tempConfig = config.clone().set(options);
		var compiler = new Compiler(tempConfig);
		compiler.compile(sources, (err, file) => {
			callback(err, tempConfig, file);
		});
	}

	export function compileStream(options: IConfigurationOptions, stream: any,
		callback?: (err: Error, config: Configuration, file: IFile) => void) {

		var tempConfig = config.clone().set(options);
		var compiler = new Compiler(tempConfig);
		compiler.compileStream(stream, (err, file) => {
			callback(err, tempConfig, file);
		});
	}

	export function compileContents(options: IConfigurationOptions,
		file: { src?: string; contents: string; },
		callback?: (err: Error, config: Configuration, file: IFile) => void) {

		var tempConfig = config.clone().set(options);
		var compiler = new Compiler(tempConfig);
		compiler.tryCompileContents(file, (err, compiled) => {
			callback(err, tempConfig, compiled);
		});
	}

	export class Compiler    extends _Compiler {}
	export class Rule        extends _Rule {}
	export class Block       extends _Block {}
	export class Element     extends _Element {}
	export class MediaAtRule extends _MediaAtRule {}
	export class Modifier    extends _Modifier {}

	export interface IConfigurationOptions extends _IConfigurationOptions {}
	export interface IBlockDeclarations    extends _IBlockDeclarations {}
	export interface IElementDeclarations  extends _IElementDeclarations {}
	export interface IModifierDeclarations extends _IModifierDeclarations {}
	export interface IRuleBody             extends _IRuleBody {}

}

export = Blink;

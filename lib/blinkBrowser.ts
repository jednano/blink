///<reference path="../bower_components/dt-vinyl/vinyl.d.ts" />
import _Block = require('./Block');
import _Compiler = require('./CompilerBrowser');
import _Element = require('./Element');
import _IBlockBody = require('./interfaces/IBlockBody');
import _IConfigurationOptions = require('./interfaces/IConfigurationOptions');
import _IElementBody = require('./interfaces/IElementBody');
import _IExtender = require('./interfaces/IExtender');
import _IModifierBody = require('./interfaces/IModifierBody');
import _IOverride = require('./interfaces/IOverride');
import _IRuleBody = require('./interfaces/IRuleBody');
import _MediaAtRule = require('./MediaAtRule');
import _Modifier = require('./Modifier');
import _Rule = require('./Rule');
import Configuration = require('./Configuration');

module Blink {

	export var config = new Configuration();

	export function compile(contents: string,
		callback: (err: Error, css: string) => void,
		options?: IConfigurationOptions) {
		var tempConfig = config.clone().set(options || {});
		var compiler = new Compiler(tempConfig);
		compiler.compile(contents, callback);
	}

	export class Compiler extends _Compiler { }
	export class Rule extends _Rule { }
	export class Block extends _Block { }
	export class Element extends _Element { }
	export class MediaAtRule extends _MediaAtRule { }
	export class Modifier extends _Modifier { }

	export interface IConfigurationOptions extends _IConfigurationOptions { }
	export interface IBlockBody extends _IBlockBody { }
	export interface IElementBody extends _IElementBody { }
	export interface IExtender extends _IExtender { }
	export interface IModifierBody extends _IModifierBody { }
	export interface IOverride extends _IOverride { }
	export interface IRuleBody extends _IRuleBody { }

}

export = Blink;

///<reference path="../bower_components/dt-node/node.d.ts"/>
import os = require('os');
var extend = require('node.extend');

import IConfigurationOptions = require('./interfaces/IConfigurationOptions');
import IBrowserSupportOptions = require('./interfaces/IBrowserSupportOptions');


class Configuration implements IConfigurationOptions {

	public outputStyle: string;

	// ReSharper disable InconsistentNaming
	private _oneIndent: string;

	public get oneIndent() {
		switch (this.outputStyle) {
			case 'compact':
			case 'compressed':
				return '';
			default:
				return this._oneIndent;
		}
	}

	public set oneIndent(value: string) {
		this._oneIndent = value;
	}

	private _newline: string;

	public get newline() {
		switch (this.outputStyle) {
			case 'compact':
			case 'compressed':
				return '';
			default:
				return this._newline;
		}
	}

	public set newline(value: string) {
		this._newline = value;
	}

	private _quoteType: string;

	public get quoteType() {
		return this._quoteType;
	}

	public set quoteType(value: string) {
		value = value.toLowerCase();
		switch (value) {
			case 'single':
			case 'double':
				this._quoteType = value;
				return;
			default:
				throw new Error('Unsupported quote type: ' + value);
		}
	}

	public get quote() {
		return {
			single: "'",
			'double': '"'
		}[this._quoteType];
	}
	// ReSharper restore InconsistentNaming

	public get oneSpace() {
		return (this.outputStyle === 'compressed') ? '' : ' ';
	}

	public get declarationSeparator() {
		switch (this.outputStyle) {
			case 'compact':
				return ' ';
			case 'compressed':
				return '';
			default:
				return this.newline + this.oneIndent;
		}
	}

	// ReSharper disable once InconsistentNaming
	private _blockFormat: string;
	get blockFormat() {
		return this._blockFormat;
	}
	set blockFormat(value: string) {
		this.validateFormat(value);
		this._blockFormat = value;
	}

	private validateFormat(format: string) {
		if (!~format.indexOf('%s')) {
			throw new Error('Invalid format. Expected "%s".');
		}
	}

	// ReSharper disable once InconsistentNaming
	private _elementFormat: string;
	get elementFormat() {
		return this._elementFormat;
	}
	set elementFormat(value: string) {
		this.validateFormat(value);
		this._elementFormat = value;
	}

	// ReSharper disable once InconsistentNaming
	private _modifierFormat: string;
	get modifierFormat() {
		return this._modifierFormat;
	}
	set modifierFormat(value: string) {
		this.validateFormat(value);
		this._modifierFormat = value;
	}

	public browserSupport: IBrowserSupportOptions;

	constructor(options?: IConfigurationOptions) {
		this.set(options);
	}

	public set(options?: IConfigurationOptions) {
		options = options || {};
		this.setOutputStyle(options);
		this.setBEMOptions(options);
		this.setBrowserSupport(options);
	}

	private setOutputStyle(options: IConfigurationOptions) {
		this.outputStyle = options.outputStyle || 'nested';
		this.oneIndent = options.oneIndent || '  ';
		this.quoteType = options.quoteType || 'double';
		this.newline = options.newline || os.EOL;
	}

	private setBEMOptions(options: IConfigurationOptions) {
		this.blockFormat = options.blockFormat || '.%s';
		this.elementFormat = options.elementFormat || '__%s';
		this.modifierFormat = options.modifierFormat || '--%s';
	}

	private setBrowserSupport(options: IConfigurationOptions) {
		var defaults: IBrowserSupportOptions = {
			chrome: 31,
			firefox: 27,
			ie: 8,
			opera: 20
		};
		this.browserSupport = extend(options.browserSupport, defaults);
	}

}

export = Configuration;

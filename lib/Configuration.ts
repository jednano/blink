///<reference path="../bower_components/dt-node/node.d.ts"/>
import os = require('os');

import IConfigurationOptions = require('./interfaces/IConfigurationOptions');


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

	public get ruleSeparator() {
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
		if (!~format.indexOf('{0}')) {
			throw new Error('Invalid format. Expected "{0}".');
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

	constructor(options?: IConfigurationOptions) {
		this.set(options);
	}

	public set(options?: IConfigurationOptions) {
		options = options || {};
		this.outputStyle = options.outputStyle || 'nested';
		this.oneIndent = options.oneIndent || '  ';
		this.quoteType = options.quoteType || 'double';
		this.newline = options.newline || os.EOL;
		this.blockFormat = options.blockFormat || '.{0}';
		this.elementFormat = options.elementFormat || '__{0}';
		this.modifierFormat = options.modifierFormat || '--{0}';
	}

}

export = Configuration;

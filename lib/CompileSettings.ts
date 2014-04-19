import os = require('os');

import ICompileSettings = require('./interfaces/ICompileSettings');


class CompileSettings implements ICompileSettings {

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

	constructor(settings?: ICompileSettings) {
		settings = settings || {};
		this.outputStyle = settings.outputStyle || 'nested';
		this.oneIndent = settings.oneIndent || '  ';
		this.quoteType = settings.quoteType || 'double';
		this.newline = settings.newline || os.EOL;
	}
}

export = CompileSettings;

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

	public get quote() {
		return this._quoteType === 'single' ? "'" : '"';
	}

	public set quote(value: string) {
		this._quoteType = (value === '"') ? 'double' : 'single';
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
		this.quote = settings.quoteType || 'single';
		this.newline = settings.newline || os.EOL;
	}
}

export = CompileSettings;

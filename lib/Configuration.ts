///<reference path="../bower_components/dt-node/node.d.ts"/>
import os = require('os');
var extend = require('node.extend');

import IConfigurationOptions = require('./interfaces/IConfigurationOptions');
import s = require('./helpers/string');


var ONE_INDENT = /(\d+)([st])/;

var styles = {
	nested: null,
	expanded: null,
	compact: null,
	compressed: null
};

var newlines = {
	os: os.EOL,
	lf: '\n',
	crlf: '\r\n'
};

var quotes = {
	'double': '"',
	'single': "'"
};

class Configuration implements IConfigurationOptions {

	private _style: string;

	public get style() {
		return this._style;
	}

	public set style(value: string) {
		value = value.toLowerCase();
		if (!styles.hasOwnProperty(value)) {
			throw new Error('Unsupported style: ' + value);
		}
		this._style = value;
	}

	private _oneIndent: any;

	public get oneIndent() {
		switch (this.style) {
			case 'compact':
			case 'compressed':
				return '';
			default:
				if (this._oneIndent === 0) {
					return '';
				}
				var m = this._oneIndent.match(ONE_INDENT);
				return s.repeat({ s: ' ', t: '\t' }[m[2]], parseInt(m[1], 10));
		}
	}

	public set oneIndent(value: any) {
		if (value.toString()[0] === '0') {
			this._oneIndent = 0;
			return;
		}
		value = value.toString().toLowerCase();
		if (!ONE_INDENT.test(value)) {
			throw new Error('Unsupported oneIndent format: ' + value);
		}
		this._oneIndent = value;
	}

	private _newline: string;

	public get newline() {
		switch (this.style) {
			case 'compact':
			case 'compressed':
				return '';
			default:
				return newlines[this._newline];
		}
	}

	public set newline(value: string) {
		value = value.toLowerCase();
		if (!newlines.hasOwnProperty(value)) {
			throw new Error('Unsupported newline: ' + value);
		}
		this._newline = value;
	}

	private _quote: string;

	public get quote() {
		return quotes[this._quote];
	}

	public set quote(value: string) {
		value = value.toLowerCase();
		if (!quotes.hasOwnProperty(value)) {
			throw new Error('Unsupported quote type: ' + value);
		}
		this._quote = value;
	}

	public get oneSpace() {
		return (this.style === 'compressed') ? '' : ' ';
	}

	public get declarationSeparator() {
		switch (this.style) {
			case 'compact':
				return ' ';
			case 'compressed':
				return '';
			default:
				return this.newline + this.oneIndent;
		}
	}

	private _block: string;

	get block() {
		return this._block;
	}

	set block(value: string) {
		if (!~value.indexOf('%s')) {
			throw new Error('Invalid block format. Expected "%s".');
		}
		this._block = value;
	}

	private _element: string;

	get element() {
		return this._element;
	}

	set element(value: string) {
		if (!~value.indexOf('%s')) {
			throw new Error('Invalid element format. Expected "%s".');
		}
		this._element = value;
	}

	private _modifier: string;

	get modifier() {
		return this._modifier;
	}

	set modifier(value: string) {
		if (!~value.indexOf('%s')) {
			throw new Error('Invalid modifier format. Expected "%s".');
		}
		this._modifier = value;
	}

	private _chrome: number;

	get chrome() {
		return this._chrome;
	}

	set chrome(value: number) {
		if (typeof value !== 'number') {
			throw new Error('Invalid Chrome version. Expected number.');
		}
		this._chrome = value;
	}

	private _firefox: number;

	get firefox() {
		return this._firefox;
	}

	set firefox(value: number) {
		if (typeof value !== 'number') {
			throw new Error('Invalid Firefox version. Expected number.');
		}
		this._firefox = value;
	}

	private _ie: number;

	get ie() {
		return this._ie;
	}

	set ie(value: number) {
		if (typeof value !== 'number') {
			throw new Error('Invalid IE version. Expected number.');
		}
		this._ie = value;
	}

	private _opera: number;

	get opera() {
		return this._opera;
	}

	set opera(value: number) {
		if (typeof value !== 'number') {
			throw new Error('Invalid Opera version. Expected number.');
		}
		this._opera = value;
	}

	constructor(options?: IConfigurationOptions) {
		this.set(extend(require('../defaults.json'), options || {}));
	}

	public set(options?: IConfigurationOptions) {
		Object.keys(options).forEach(key => {
			this[key] = options[key];
		});
	}

}

export = Configuration;

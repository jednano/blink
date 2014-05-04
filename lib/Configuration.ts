///<reference path="../bower_components/dt-node/node.d.ts"/>
import fs = require('fs');
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

	public raw: IConfigurationOptions = {};

	public toString() {
		return JSON.stringify(this.raw);
	}

	public get config() {
		return this.raw.config;
	}

	public set config(path: string) {
		this.raw.config = path;
	}

	public get style() {
		return this.raw.style;
	}

	public set style(value: string) {
		value = value.toLowerCase();
		if (!styles.hasOwnProperty(value)) {
			throw new Error('Unsupported style: ' + value);
		}
		this.raw.style = value;
	}

	public get oneIndent() {
		switch (this.style) {
			case 'compact':
			case 'compressed':
				return '';
			default:
				if (this.raw.oneIndent === '0') {
					return '';
				}
				var m = this.raw.oneIndent.match(ONE_INDENT);
				return s.repeat({ s: ' ', t: '\t' }[m[2]], parseInt(m[1], 10));
		}
	}

	public set oneIndent(value: any) {
		if (value.toString()[0] === '0') {
			this.raw.oneIndent = '0';
			return;
		}
		value = value.toString().toLowerCase();
		if (!ONE_INDENT.test(value)) {
			throw new Error('Unsupported oneIndent format: ' + value);
		}
		this.raw.oneIndent = value;
	}

	public get newline() {
		switch (this.style) {
			case 'compact':
			case 'compressed':
				return '';
			default:
				return newlines[this.raw.newline];
		}
	}

	public set newline(value: string) {
		value = value.toLowerCase();
		if (!newlines.hasOwnProperty(value)) {
			throw new Error('Unsupported newline: ' + value);
		}
		this.raw.newline = value;
	}

	public get quote() {
		return quotes[this.raw.quote];
	}

	public set quote(value: string) {
		value = value.toLowerCase();
		if (!quotes.hasOwnProperty(value)) {
			throw new Error('Unsupported quote type: ' + value);
		}
		this.raw.quote = value;
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

	get block() {
		return this.raw.block;
	}

	set block(value: string) {
		if (!~value.indexOf('%s')) {
			throw new Error('Invalid block format. Expected "%s".');
		}
		this.raw.block = value;
	}

	get element() {
		return this.raw.element;
	}

	set element(value: string) {
		if (!~value.indexOf('%s')) {
			throw new Error('Invalid element format. Expected "%s".');
		}
		this.raw.element = value;
	}

	get modifier() {
		return this.raw.modifier;
	}

	set modifier(value: string) {
		if (!~value.indexOf('%s')) {
			throw new Error('Invalid modifier format. Expected "%s".');
		}
		this.raw.modifier = value;
	}

	get chrome() {
		return this.raw.chrome;
	}

	set chrome(value: number) {
		if (typeof value !== 'number') {
			throw new Error('Invalid Chrome version. Expected number.');
		}
		this.raw.chrome = value;
	}

	get firefox() {
		return this.raw.firefox;
	}

	set firefox(value: number) {
		if (typeof value !== 'number') {
			throw new Error('Invalid Firefox version. Expected number.');
		}
		this.raw.firefox = value;
	}

	get ie() {
		return this.raw.ie;
	}

	set ie(value: number) {
		if (typeof value !== 'number') {
			throw new Error('Invalid IE version. Expected number.');
		}
		this.raw.ie = value;
	}

	get opera() {
		return this.raw.opera;
	}

	set opera(value: number) {
		if (typeof value !== 'number') {
			throw new Error('Invalid Opera version. Expected number.');
		}
		this.raw.opera = value;
	}

	constructor(options?: IConfigurationOptions) {
		options = options || {};
		if (options.config) {
			options = extend(this.loadConfig(options.config), options);
		}
		this.set(extend(require('../defaults.json'), options));
	}

	private loadConfig(filename: string) {
		if (!fs.existsSync(filename)) {
			throw new Error('Configuration file does not exist: ' + filename);
		}
		var contents = <string><any>fs.readFileSync(filename, { encoding: 'utf8' });
		try {
			var config = JSON.parse(contents);
		} catch (e) {
			throw new Error('Invalid JSON format: ' + filename);
		}
		return config;
	}

	public set(options: IConfigurationOptions) {
		extend(this.raw, options);
	}

}

export = Configuration;

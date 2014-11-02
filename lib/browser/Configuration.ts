var extend = require('node.extend');

import _overrides = require('../overrides/all');
import ConfigurationOptions = require('../interfaces/ConfigurationOptions');
import Overrides = require('../interfaces/Overrides');
import s = require('../helpers/string');

var ONE_INDENT = /(\d+)([st])/;

var styles = {
	nested: null,
	expanded: null,
	compact: null,
	compressed: null
};

var newlines = {
	lf: '\n',
	crlf: '\r\n'
};

var quotes = {
	'double': '"',
	'single': "'"
};

class Configuration implements ConfigurationOptions {

	constructor(options?: ConfigurationOptions) {
		this.set(require('../../defaults.browser.json'));
		this.set(options);
	}

	public clone() {
		var clone = new Configuration(this.raw);
		clone.overrides = this.overrides;
		return clone;
	}

	public set(options: ConfigurationOptions) {
		extend(this.raw, options || {});
		return this;
	}

	public raw: ConfigurationOptions = {};

	public toString() {
		return JSON.stringify(this.raw);
	}

	/**
	 * The location of the config file
	 */
	public get config() {
		return this.raw.config;
	}

	public set config(path: string) {
		this.raw.config = path;
	}

	public get quiet() {
		return this.raw.quiet;
	}

	public set quiet(value: boolean) {
		this.raw.quiet = value;
	}

	public get trace() {
		return this.raw.trace;
	}

	public set trace(value: boolean) {
		this.raw.trace = value;
	}

	public get force() {
		return this.raw.force;
	}

	public set force(value: boolean) {
		this.raw.force = value;
	}

	public get boring() {
		return this.raw.boring;
	}

	public set boring(value: boolean) {
		this.raw.boring = value;
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
				return this.newline;
		}
	}

	public get ruleSeparator() {
		switch (this.style) {
			case 'compact':
				return newlines[this.raw.newline];
			case 'compressed':
				return '';
			default:
				return this.newline;
		}
	}

	get block() {
		return this.raw.block;
	}

	set block(value: string) {
		if (value.indexOf('%s') === -1) {
			throw new Error('Invalid block format. Expected "%s".');
		}
		this.raw.block = value;
	}

	get element() {
		return this.raw.element;
	}

	set element(value: string) {
		if (value.indexOf('%s') === -1) {
			throw new Error('Invalid element format. Expected "%s".');
		}
		this.raw.element = value;
	}

	get modifier() {
		return this.raw.modifier;
	}

	set modifier(value: string) {
		if (value.indexOf('%s') === -1) {
			throw new Error('Invalid modifier format. Expected "%s".');
		}
		this.raw.modifier = value;
	}

	public get overrides() {
		return _overrides;
	}

}

export = Configuration;

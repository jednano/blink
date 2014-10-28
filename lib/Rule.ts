var extend = require('node.extend');

import a = require('./helpers/array');
import Configuration = require('./browser/Configuration');
import Formatter = require('./Formatter');
import MediaAtRule = require('./MediaAtRule');
import RuleBody = require('./interfaces/RuleBody');
import s = require('./helpers/string');


class Rule {

	private config: Configuration;
	private decs: any[][];

	public get responders() {
		return this.body.respond;
	}

	private _selectors: string[];

	public get selectors() {
		return this._selectors;
	}

	public set selectors(value: any) {
		if (!value) {
			this._selectors = [];
			return;
		}
		if (typeof value === 'string') {
			value = this.splitSelectors(value);
		}
		this._selectors = value.map(selector => {
			return selector.trim();
		});
	}

	constructor(selectors: any, public body?: RuleBody) {
		this.selectors = selectors;
	}

	private splitSelectors(selectors: string) {
		return selectors.split(/ *, */);
	}

	public resolve(config: Configuration) {
		this.config = config;
		var body = this.clone().body;
		delete body.respond;
		var rules = this.resolveTree(this.selectors.join(), {}, '', body);
		return Object.keys(rules).map(key => {
			return [this.splitSelectors(key), rules[key]];
		});
	}

	private resolveTree(selectors: string, seed: any, key: string, body: any) {
		Object.keys(body).forEach(k2 => {
			if (k2[0] === ':') {
				this.resolveTree(
					this.joinSelectors(selectors, k2),
					seed, '', body[k2]
				);
				return;
			}
			var k1 = key || '';
			var joinedKey = this.combineKeys(k1, k2);
			var result = this.resolveOverride(s.camelize(joinedKey), body[k2]);
			var value = result.value;
			if (result.isOverrideResult) {
				if (Array.isArray(value)) {
					seed[selectors] = seed[selectors] || [];
					[].push.apply(seed[selectors], value);
					return;
				}
				Object.keys(value).forEach(s2 => {
					var s3 = this.joinSelectors(selectors, s2);
					seed[s3] = seed[s3] || [];
					[].push.apply(seed[s3], value[s2]);
				});
				return;
			}
			if (this.isDeclarationValue(value)) {
				seed[selectors] = seed[selectors] || [];
				seed[selectors].push([
					s.dasherize(joinedKey),
					this.compileDeclarationValue(value)
				]);
				return;
			}
			this.resolveTree(selectors, seed, joinedKey, value);
			key = k1;
		});
		return seed;
	}

	private joinSelectors(left: string, right: string) {
		var result = [];
		this.splitSelectors(left).forEach(s1 => {
			this.splitSelectors(right).forEach(s2 => {
				result.push(s1 + s2);
			});
		});
		return result.join();
	}

	public clone() {
		return new Rule(extend([], this.selectors), extend({}, this.body));
	}

	private resolveOverride(key: string, value: any) {
		var override = this.config.overrides[s.camelize(key)];
		switch (typeof override) {
			case 'function':
				var fn: Function;
				if (Array.isArray(value)) {
					fn = override(value[0], value[1]);
				} else {
					fn = override(value);
				}
				if (typeof fn !== 'function') {
					throw new Error('Override "' + key + '" must return a function');
				}
				return {
					isOverrideResult: true,
					value: fn(this.config)
				};
			case 'undefined':
				return {
					isOverrideResult: false,
					value: value
				};
			default:
				throw new Error('Override "' + key + '" must be of type: Function');
		}
	}

	private combineKeys(k1: string, k2: string) {
		if (k1 !== '' && k2[0] !== ':') {
			return k1 + '-' + k2;
		}
		return k1 + k2;
	}

	private isDeclarationValue(value: any) {
		if (Array.isArray(value)) {
			return true;
		}
		switch (typeof value) {
			case 'string':
			case 'number':
			case 'function':
				return true;
		}
		return false;
	}

	private compileDeclarationValue(value: any) {
		if (Array.isArray(value)) {
			return this.compileArray(value);
		}
		return this.compilePrimitive(value);
	}

	private compileArray(arr: any[]) {
		return arr.map(primitive => {
			return this.compilePrimitive(primitive);
		}).join(' ');
	}

	private compilePrimitive(value: any) {
		switch (typeof value) {
			case 'number':
				if (value === 0) {
					return '0';
				}
				return value + 'px';
			case 'function':
				return this.compilePrimitive(value(this.config));
			case 'string':
				if (value === '') {
					return s.repeat(this.config.quote, 2);
				}
				if (value.indexOf(' ') > -1) {
					var quote = this.config.quote;
					return quote + value.replace(new RegExp(quote, 'g'), '\\' + quote) + quote;
				}
		}
		return value;
	}

	public compile(config: Configuration) {
		return new Formatter().format(config, this.resolve(config));
	}

}

export = Rule;

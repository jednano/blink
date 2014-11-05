var extend = require('node.extend');

import a = require('./helpers/array');
import Configuration = require('./browser/Configuration');
import Formatter = require('./Formatter');
import HashTable = require('./interfaces/HashTable');
import RuleBody = require('./interfaces/RuleBody');
import s = require('./helpers/string');


class Rule {

	private config: Configuration;
	private decs: any[][];

	public get responders() {
		return this.body.respond;
	}

	private _selectors: string[] = [];

	public get selectors() {
		return this._selectors;
	}

	public set selectors(value: any) {
		this._selectors = value.map(selector => {
			return selector.trim();
		});
	}

	private splitSelectors(selectors: string) {
		return selectors.split(/ *, */);
	}

	constructor(selectors: string[], body?: RuleBody);
	constructor(selectors: string, body?: RuleBody);
	constructor(selectors: any, public body?: RuleBody) {
		if (Array.isArray(selectors)) {
			this.selectors = selectors;
		} else {
			this.selectors = this.splitSelectors(selectors);
		}
	}

	public resolve(config: Configuration) {
		this.config = config;
		var body = this.clone().body;
		var rules = this.resolveTree(this.selectors.join(), body);
		return Object.keys(rules).map(key => {
			return [this.splitSelectors(key), rules[key]];
		});
	}

	public clone() {
		return new Rule(extend([], this.selectors), extend({}, this.body));
	}

	private resolveTree(selectors: string, body: any, seed?: any, key?: string) {
		seed = seed || {};
		key = key || '';
		Object.keys(body).forEach(k2 => {
			if (k2 === 'respond') {
				this.resolveResponders(selectors, body.respond, seed);
				return;
			}
			if (k2[0] === ':') {
				this.resolveTree(this.joinSelectors(selectors, k2), body[k2], seed);
				return;
			}
			var joinedKey = this.combineKeys(key, k2);
			var overrideKey = s.camelize(joinedKey);
			if (this.config.overrides.hasOwnProperty(overrideKey)) {
				this.resolveOverride(overrideKey, selectors, seed, body[k2]);
				return;
			}
			var value = body[k2];
			if (this.isDeclarationValue(value)) {
				seed[selectors] = seed[selectors] || [];
				seed[selectors].push([
					s.dasherize(joinedKey),
					this.compileDeclarationValue(value)
				]);
				return;
			}
			this.resolveTree(selectors, value, seed, joinedKey);
		});
		return seed;
	}

	private resolveResponders(selectors: string, body: any, seed: any) {
		Object.keys(body).forEach(condition => {
			var mediaQuery = '@media ' + condition;
			var resolved = this.resolveTree(
				selectors,
				body[condition],
				seed[mediaQuery]
			);
			var keys = Object.keys(resolved);
			if (keys.length === 0) {
				return;
			}
			seed[mediaQuery] = keys.map(key => {
				return [this.splitSelectors(key), resolved[key]];
			});
		});
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

	private combineKeys(k1: string, k2: string) {
		if (k1 !== '' && k2[0] !== ':') {
			return k1 + '-' + k2;
		}
		return k1 + k2;
	}

	private resolveOverride(overrideKey: string, selectors: string, seed: any, value: any) {
		var override = this.config.overrides[overrideKey];
		if (typeof override !== 'function') {
			throw new Error('Override "' + overrideKey + '" must be of type: Function');
		}
		var fn: Function;
		if (Array.isArray(value)) {
			fn = override(value[0], value[1]);
		} else {
			fn = override(value);
		}
		if (typeof fn !== 'function') {
			throw new Error('Override "' + overrideKey + '" must return a function');
		}
		var result = fn(this.config);
		if (Array.isArray(result)) {
			seed[selectors] = result;
			return;
		}
		Object.keys(result).forEach(key => {
			seed[this.joinSelectors(selectors, key)] = result[key];
		});
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

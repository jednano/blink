import os = require('os');

import Configuration = require('./Configuration');
import IDeclarationTree = require('./interfaces/IDeclarationTree');


class DeclarationTree {

	private config: Configuration;

	constructor(public root: IDeclarationTree) {
	}

	public resolve() {
		return this.resolveDeclarations({}, '', this.root);
	}

	private resolveDeclarations(seed: IDeclarationTree, key: string, rules: IDeclarationTree) {
		Object.keys(rules).forEach(k2 => {
			var k1 = key;
			key = this.combineKeys(k1, k2);
			var value = rules[k2];
			if (this.checkValueIsResolved(value)) {
				seed[key] = value;
			} else {
				this.resolveDeclarations(seed, key, value);
			}
			key = k1;
		});
		return seed;
	}

	private combineKeys(k1: string, k2: string) {
		if (k1 !== '' && k2[0] !== ':') {
			return k1 + '-' + k2;
		}
		return k1 + k2;
	}

	private checkValueIsResolved(value: any) {
		if (value instanceof Array) {
			return true;
		}
		switch (typeof value) {
			case 'string':
			case 'number':
				return true;
		}
		return false;
	}

	public compile(config?: Configuration) {
		this.config = config = config || new Configuration();
		var declarations = this.resolve();
		return config.oneIndent + Object.keys(declarations).map(key => {
			var value = this.compileValue(declarations[key]);
			return key + ':' + config.oneSpace + value + ';';
		}).join(config.ruleSeparator) + config.newline;
	}

	private compileValue(value: any): any {
		if (value instanceof Array) {
			return (<Array<any>>value).map(primitive => {
				return this.compilePrimitive(primitive);
			}).join(' ');
		} else {
			return this.compilePrimitive(value);
		}
	}

	private compilePrimitive(value: any) {
		switch (typeof value) {
			case 'string':
				var quote = this.config.quote;
				return quote + value.replace(new RegExp(quote, 'g'), '\\' + quote) + quote;
			case 'number':
				return value ? value + 'px' : value;
			default:
				throw new Error('Unexpected type: ' + typeof value);
		}
	}
}

export = DeclarationTree;

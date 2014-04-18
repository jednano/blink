import os = require('os');

import CompileSettings = require('./CompileSettings');
import IDeclarationTree = require('./interfaces/IDeclarationTree');


class DeclarationTree {

	private compileSettings: CompileSettings;

	constructor(public root: IDeclarationTree) {
	}

	public resolve() {
		return this.resolveDeclarations({}, '', this.root);
	}

	private resolveDeclarations(seed: IDeclarationTree, key: string, rules: IDeclarationTree) {
		Object.keys(rules).forEach(k2 => {
			key = this.combineKeys(key, k2);
			var value = rules[k2];
			if (this.checkValueIsResolved(value)) {
				seed[key] = value;
				key = '';
			} else {
				this.resolveDeclarations(seed, key, value);
			}
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

	public compile(settings?: CompileSettings) {
		this.compileSettings = settings = settings || new CompileSettings();
		var declarations = this.resolve();
		return settings.oneIndent + Object.keys(declarations).map(key => {
			var value = this.compileValue(declarations[key]);
			return key + ':' + settings.oneSpace + value + ';';
		}).join(settings.ruleSeparator) + settings.newline;
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
				var quote = this.compileSettings.quote;
				return quote + value.replace(new RegExp(quote, 'g'), '\\' + quote) + quote;
			case 'number':
				return value ? value + 'px' : value;
			default:
				throw new Error('Unexpected type: ' + typeof value);
		}
	}
}

export = DeclarationTree;

import Configuration = require('./Configuration');
import IDeclarationTree = require('./interfaces/IDeclarationTree');
import compilers = require('./compilers');


class DeclarationTree {

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

	public compile(config: Configuration) {
		return compilers.compileDeclarationTree(config, this.resolve());
	}
}

export = DeclarationTree;

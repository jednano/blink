import IDeclarationTree = require('./interfaces/IDeclarationTree');
import Configuration = require('./Configuration');
import s = require('./helpers/string');


export function compileDeclarationTree(config: Configuration, declarations: IDeclarationTree) {
	return compileDeclarations(config, Object.keys(declarations).map(key => {
		return [key, declarations[key]];
	}));
}

export function compileDeclarations(config: Configuration, declarations: string[][]) {
	var css = declarations.map(declaration => {
		var property = declaration[0];
		var value = compileValue(config, declaration[1]);
		return s.dasherize(property) + ':' + config.oneSpace + value + ';';
	}).join(config.declarationSeparator);
	return css.length ? config.oneIndent + css + config.newline : '';
}

export function compileValue(config: Configuration, value: any): any {
	if (value instanceof Array) {
		return (<Array<any>>value).map(primitive => {
			return compilePrimitive(config, primitive);
		}).join(' ');
	} else {
		return compilePrimitive(config, value);
	}
}

export function compilePrimitive(config: Configuration, value: any) {
	switch (typeof value) {
		case 'string':
			if (~value.indexOf(' ')) {
				var quote = config.quote;
				return quote + value.replace(new RegExp(quote, 'g'), '\\' + quote) + quote;
			}
			return value;
		case 'number':
			return value ? value + 'px' : value;
		default:
			throw new Error('Unexpected type: ' + typeof value);
	}
}

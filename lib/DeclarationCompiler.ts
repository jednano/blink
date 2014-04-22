import Configuration = require('./Configuration');
import s = require('./helpers/string');


class DeclarationCompiler {

	public compile(config: Configuration, declarations: string[][]) {
		var css = declarations.map(declaration => {
			var property = s.dasherize(declaration[0]);
			var value = this.compileValue(config, declaration[1]);
			return property + ':' + config.oneSpace + value + ';';
		}).join(config.declarationSeparator);
		return css.length ? config.oneIndent + css + config.newline : '';
	}

	private compileValue(config: Configuration, value: any): any {
		if (value instanceof Array) {
			return (<Array<any>>value).map(primitive => {
				return this.compilePrimitive(config, primitive);
			}).join(' ');
		} else {
			return this.compilePrimitive(config, value);
		}
	}

	private compilePrimitive(config: Configuration, value: any) {
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

}

export = DeclarationCompiler;

import Configuration = require('./Configuration');
import IRuleBody = require('./interfaces/IRuleBody');
import s = require('./helpers/string');


class Formatter {

	private config: Configuration;

	format(config: Configuration, body: any[]) {
		this.config = config;
		return this.formatBody(body, 0);
	}

	private formatBody(body: any[], level: number) {

		if (!body || !body.length) {
			return '';
		}

		var firstPair = body[0];
		if (!firstPair || !firstPair.length) {
			return '';
		}

		var firstKey = firstPair[0];
		if (!firstKey) {
			return '';
		}

		var firstVal = firstPair[1];
		if (!firstVal || !firstVal.length) {
			return '';
		}

		if (firstKey[0] === '@' || !this.isDeclarationValue(firstVal)) {
			return this.formatRules(body, level);
		}

		return this.formatDeclarations(body, level);
	}

	private isDeclarationValue(value: any) {
		return typeof value === 'string';
	}

	private formatDeclarations(decs: any[], level: number) {
		var indent = s.repeat(this.config.oneIndent, level);
		return decs.map(dec => {
			var prop = dec[0];
			var val = dec[1];
			var css = indent;
			css += prop + ':' + this.config.oneSpace;
			css += this.formatValue(val) + ';';
			return css;
		}).join(this.config.declarationSeparator) + this.config.newline;
	}

	private formatValue(value: any) {
		if (typeof value === 'string') {
			return value;
		}
		return (<string[]>value).join(' ');
	}

	private formatRules(rule: any[], level: number) {
		var rules = [];
		rule.forEach(pair => {
			var formattedRule = this.formatRule(pair[0], pair[1], level);
			if (formattedRule) {
				rules.push(formattedRule);
			}
		});
		return rules.join(this.config.newline);
	}

	private formatRule(selectors: string, value: any[], level: number) {
		var body = this.formatBody(value, level + 1);
		if (!body) {
			return '';
		}
		var config = this.config;
		var indent = s.repeat(config.oneIndent, level);
		var css = indent + selectors + config.oneSpace + '{' + config.newline;
		css += body;
		css += indent + '}' + config.newline;
		return css;
	}

}

export = Formatter;

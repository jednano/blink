import IRuleBody = require('./interfaces/IRuleBody');
import Rule = require('./Rule');


class MediaAtRule extends Rule {
	constructor(public condition: string, public body?: IRuleBody) {
		super(null, body);
		this.condition = '@media ' + condition;
	}
}

export = MediaAtRule;

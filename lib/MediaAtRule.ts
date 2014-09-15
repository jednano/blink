import Rule = require('./Rule');
import RuleBody = require('./interfaces/RuleBody');


class MediaAtRule extends Rule {
	constructor(public condition: string, public body?: RuleBody) {
		super(null, body);
		this.condition = '@media ' + condition;
	}
}

export = MediaAtRule;

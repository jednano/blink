import Rule = require('./Rule');
import RuleBody = require('./interfaces/RuleBody');
declare class MediaAtRule extends Rule {
    public condition: string;
    public body: RuleBody;
    constructor(condition: string, body?: RuleBody);
}
export = MediaAtRule;

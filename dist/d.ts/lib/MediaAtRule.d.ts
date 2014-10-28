import Rule = require('./Rule');
import RuleBody = require('./interfaces/RuleBody');
declare class MediaAtRule extends Rule {
    condition: string;
    body: RuleBody;
    constructor(condition: string, body?: RuleBody);
}
export = MediaAtRule;

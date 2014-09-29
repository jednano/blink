import HashTable = require('./HashTable');
import MediaAtRule = require('../MediaAtRule');
interface RuleBody extends HashTable<any> {
    extend?: any[];
    include?: Function[];
    respond?: MediaAtRule[];
}
export = RuleBody;

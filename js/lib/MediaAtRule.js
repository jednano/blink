var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rule = require('./Rule');

var MediaAtRule = (function (_super) {
    __extends(MediaAtRule, _super);
    function MediaAtRule(condition, body) {
        _super.call(this, null, body);
        this.condition = condition;
        this.body = body;
        this.condition = '@media ' + condition;
    }
    return MediaAtRule;
})(Rule);

module.exports = MediaAtRule;

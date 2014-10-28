/* istanbul ignore next: TypeScript extend */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _Block = require('../Block');
var _BrowserConfiguration = require('./Configuration');
var _Compiler = require('../Compiler');
var _Element = require('../Element');
var _MediaAtRule = require('../MediaAtRule');
var _Modifier = require('../Modifier');
var _Rule = require('../Rule');
function blink(contents, callback, options) {
    var compiler = new blink.Compiler(new blink.Configuration(options || {}));
    compiler.compile(contents, callback);
}
// ReSharper disable once InconsistentNaming
var blink;
(function (blink) {
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block() {
            _super.apply(this, arguments);
        }
        return Block;
    })(_Block);
    blink.Block = Block;
    var Compiler = (function (_super) {
        __extends(Compiler, _super);
        function Compiler() {
            _super.apply(this, arguments);
        }
        return Compiler;
    })(_Compiler);
    blink.Compiler = Compiler;
    var Configuration = (function (_super) {
        __extends(Configuration, _super);
        function Configuration() {
            _super.apply(this, arguments);
        }
        return Configuration;
    })(_BrowserConfiguration);
    blink.Configuration = Configuration;
    var Element = (function (_super) {
        __extends(Element, _super);
        function Element() {
            _super.apply(this, arguments);
        }
        return Element;
    })(_Element);
    blink.Element = Element;
    var MediaAtRule = (function (_super) {
        __extends(MediaAtRule, _super);
        function MediaAtRule() {
            _super.apply(this, arguments);
        }
        return MediaAtRule;
    })(_MediaAtRule);
    blink.MediaAtRule = MediaAtRule;
    var Modifier = (function (_super) {
        __extends(Modifier, _super);
        function Modifier() {
            _super.apply(this, arguments);
        }
        return Modifier;
    })(_Modifier);
    blink.Modifier = Modifier;
    var Rule = (function (_super) {
        __extends(Rule, _super);
        function Rule() {
            _super.apply(this, arguments);
        }
        return Rule;
    })(_Rule);
    blink.Rule = Rule;
    blink.config = new Configuration();
})(blink || (blink = {}));
module.exports = blink;

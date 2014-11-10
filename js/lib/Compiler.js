/* jshint evil: true */
var a = require('./helpers/array');
var Formatter = require('./Formatter');
var o = require('./helpers/object');
var Rule = require('./Rule');
var Compiler = (function () {
    function Compiler(config) {
        this.config = config;
    }
    Compiler.prototype.compile = function (rules) {
        function createRulesFromObject(rule) {
            return Object.keys(rule).map(function (selectors) {
                return new Rule(selectors, rule[selectors]);
            });
        }
        if (typeof rules === 'string') {
            /* tslint:disable:no-eval */
            rules = eval(rules);
        }
        rules = a.flatten([rules]).map(function (rule) {
            if (o.isPlainObject(rule)) {
                return createRulesFromObject(rule);
            }
            return rule;
        });
        return this.compileRules(a.flatten(rules));
    };
    Compiler.prototype.compileRules = function (rules) {
        return this.format(this.resolve(rules));
    };
    Compiler.prototype.resolve = function (rules) {
        var _this = this;
        return rules.map(function (rule) {
            return rule.resolve(_this.config)[0];
        });
    };
    Compiler.prototype.format = function (rules) {
        return new Formatter().format(this.config, rules);
    };
    return Compiler;
})();
module.exports = Compiler;

/* jshint evil: true */
/* tslint:disable:no-eval */
var a = require('./helpers/array');
var Formatter = require('./Formatter');
var o = require('./helpers/object');
var Rule = require('./Rule');
var Compiler = (function () {
    function Compiler(config) {
        this.config = config;
    }
    Compiler.prototype.compile = function (rules, callback) {
        if (typeof callback !== 'function') {
            return;
        }
        if (typeof rules === 'string') {
            try {
                rules = eval(rules);
            }
            catch (err) {
                callback(err);
                return;
            }
        }
        rules = a.flatten([rules]).map(function (rule) {
            if (o.isPlainObject(rule)) {
                return createRulesFromObject(rule);
            }
            return rule;
        });
        this.compileRules(a.flatten(rules), callback);
        function createRulesFromObject(obj) {
            return Object.keys(obj).map(function (selectors) {
                return new Rule(selectors, obj[selectors]);
            });
        }
    };
    Compiler.prototype.compileRules = function (rules, callback) {
        var formatted;
        try {
            var resolved = this.resolve(rules);
            formatted = this.format(resolved);
        }
        catch (err) {
            callback(err);
            return;
        }
        callback(null, formatted);
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

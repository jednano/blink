/* jshint evil: true */
/* tslint:disable:no-eval */
var a = require('./helpers/array');

var Configuration = require('./browser/Configuration');
var Formatter = require('./Formatter');

var o = require('./helpers/object');
var Rule = require('./Rule');

var Compiler = (function () {
    function Compiler(config) {
        this.config = config;
        this.config = config || new Configuration();
    }
    Compiler.prototype.compile = function (rules, callback) {
        if (typeof rules === 'string') {
            try  {
                rules = eval(rules);
            } catch (err) {
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
        try  {
            var resolved = this.resolve(rules);
            formatted = this.format(resolved);
        } catch (err) {
            callback(err);
            return;
        }
        callback(null, formatted);
    };

    Compiler.prototype.resolve = function (rules) {
        if (!Array.isArray(rules)) {
            rules = [rules];
        }
        return this.resolveRules(rules);
    };

    Compiler.prototype.resolveRules = function (rules) {
        var _this = this;
        var resolved = [];

        rules.forEach(function (rule) {
            push(rule.resolve(_this.config));
        });
        push(this.resolveResponders(rules));

        function push(val) {
            if (val && val.length) {
                resolved.push(val[0]);
            }
        }

        return resolved;
    };

    Compiler.prototype.format = function (rules) {
        return new Formatter().format(this.config, rules);
    };

    Compiler.prototype.resolveResponders = function (responders) {
        var _this = this;
        var registry = {};
        responders.forEach(function (responder) {
            _this.registerResponders(registry, responder.selectors, responder.responders);
        });
        return this.resolveTree(registry);
    };

    Compiler.prototype.registerResponders = function (registry, selectors, responders) {
        var _this = this;
        (responders || []).forEach(function (responder) {
            var condition = responder.condition;
            var scope = registry[condition] = registry[condition] || {};
            responder.selectors = selectors;
            var resolved = responder.resolve(_this.config);
            if (resolved.length) {
                resolved = resolved[0];
                scope[resolved[0].join(',' + _this.config.oneSpace)] = resolved[1];
            }
            _this.registerResponders(scope, selectors, responder.responders);
        });
    };

    Compiler.prototype.resolveTree = function (tree) {
        var _this = this;
        var result = [];
        Object.keys(tree).forEach(function (key) {
            var value = tree[key];
            if (Array.isArray(value)) {
                result.push([[key], value]);
                return;
            }
            result.push([[key], _this.resolveTree(value)]);
        });
        return result;
    };
    return Compiler;
})();

module.exports = Compiler;

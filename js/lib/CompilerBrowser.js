var a = require('./helpers/array');
var Configuration = require('./Configuration');
var ExtenderRegistry = require('./ExtenderRegistry');
var Formatter = require('./Formatter');

var Rule = require('./Rule');
var s = require('./helpers/string');

var CompilerBrowser = (function () {
    function CompilerBrowser(config) {
        this.config = config;
        this.config = config || new Configuration();
    }
    CompilerBrowser.prototype.compile = function (contents, callback) {
        try  {
            var exports = eval(contents);
        } catch (err) {
            callback(err);
            return;
        }
        var rules = a.flatten([exports]);
        this.compileRules(rules, callback);
    };

    CompilerBrowser.prototype.compileRules = function (rules, callback) {
        try  {
            var resolved = this.resolveRules(rules);
            var formatted = new Formatter().format(this.config, resolved);
            callback(null, formatted);
        } catch (err) {
            callback(err);
        }
    };

    CompilerBrowser.prototype.resolveRules = function (rules) {
        var _this = this;
        var resolved = [];

        this.resolveExtenders(rules).forEach(function (extended) {
            if (typeof extended[0] !== 'undefined') {
                resolved.push(extended[0]);
            }
        });
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

    CompilerBrowser.prototype.format = function (rules) {
        return new Formatter().format(this.config, rules);
    };

    CompilerBrowser.prototype.resolveExtenders = function (rules) {
        var _this = this;
        var extenders = new ExtenderRegistry();
        this.registerExtenders(extenders, rules);
        return extenders.map(function (extender, selectors) {
            var body = {};
            if (extender.selectors) {
                extender.selectors.forEach(function (selector) {
                    body[selector] = { include: [extender] };
                });
            } else {
                body.include = [extender];
            }
            var r = new Rule(selectors, body);
            return r.resolve(_this.config);
        });
    };

    CompilerBrowser.prototype.registerExtenders = function (extenders, rules) {
        var _this = this;
        if (!rules) {
            return;
        }
        rules.forEach(function (rule) {
            (rule.extenders || []).forEach(function (extender) {
                if (!extender.hasOwnProperty('args')) {
                    extender = extender();
                }
                extenders.add(extender, rule.selectors);
            });
            var overrides = _this.config.overrides;
            var body = rule.body;
            Object.keys(body).forEach(function (property) {
                var override = overrides[s.camelize(property)];
                if (override) {
                    override = override(body[property]);
                    extenders.add(override, rule.selectors);
                    delete body[property];
                }
            });
        });
    };

    CompilerBrowser.prototype.resolveResponders = function (responders) {
        var _this = this;
        var registry = {};
        responders.forEach(function (responder) {
            _this.registerResponders(registry, responder.selectors, responder.responders);
        });
        return this.resolveTree(registry);
    };

    CompilerBrowser.prototype.registerResponders = function (registry, selectors, responders) {
        var _this = this;
        (responders || []).forEach(function (responder) {
            var condition = responder.condition;
            var scope = registry[condition] = registry[condition] || {};
            responder.selectors = selectors;
            scope.__extended = scope.__extended || new ExtenderRegistry();
            _this.registerExtenders(scope.__extended, responders);
            var resolved = responder.resolve(_this.config);
            if (resolved.length) {
                resolved = resolved[0];
                scope[resolved[0].join(',' + _this.config.oneSpace)] = resolved[1];
            }
            _this.registerResponders(scope, selectors, responder.responders);
        });
    };

    CompilerBrowser.prototype.resolveTree = function (tree) {
        var _this = this;
        var result = [];
        Object.keys(tree).forEach(function (key) {
            var value = tree[key];
            if (value instanceof ExtenderRegistry) {
                value.forEach(function (extender, selectors) {
                    var r = new Rule(selectors, { include: [extender] });
                    result.push(r.resolve(_this.config)[0]);
                });
                delete tree[key];
            }
        });
        Object.keys(tree).forEach(function (key) {
            var value = tree[key];
            if (value instanceof Array) {
                result.push([[key], value]);
            } else if (value) {
                result.push([[key], _this.resolveTree(value)]);
            }
        });
        return result;
    };
    return CompilerBrowser;
})();

module.exports = CompilerBrowser;

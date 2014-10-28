var extend = require('node.extend');

var Formatter = require('./Formatter');

var s = require('./helpers/string');

var Rule = (function () {
    function Rule(selectors, body) {
        this.body = body;
        this.selectors = selectors;
    }
    Object.defineProperty(Rule.prototype, "responders", {
        get: function () {
            return this.body.respond;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Rule.prototype, "selectors", {
        get: function () {
            return this._selectors;
        },
        set: function (value) {
            if (!value) {
                this._selectors = [];
                return;
            }
            if (typeof value === 'string') {
                value = this.splitSelectors(value);
            }
            this._selectors = value.map(function (selector) {
                return selector.trim();
            });
        },
        enumerable: true,
        configurable: true
    });


    Rule.prototype.splitSelectors = function (selectors) {
        return selectors.split(/ *, */);
    };

    Rule.prototype.resolve = function (config) {
        var _this = this;
        this.config = config;
        var clone = this.clone();
        var body = clone.body;
        delete body.respond;

        var resolved = [];

        Object.keys(body).forEach(function (key) {
            if (key[0] === ':') {
                var selectors = _this.joinSelectors(_this.selectors, _this.splitSelectors(key));
                var pseudoRule = new Rule(selectors, body[key]);
                delete body[key];
                [].push.apply(resolved, pseudoRule.resolve(_this.config));
            }
        });

        var resolvedBody = this.resolveBody([], '', body);
        if (!resolvedBody || !resolvedBody.length) {
            return resolved;
        }

        resolved.unshift([this.selectors, resolvedBody]);
        return resolved;
    };

    Rule.prototype.joinSelectors = function (left, right) {
        var result = [];
        left.forEach(function (s1) {
            right.forEach(function (s2) {
                result.push(s1 + s2);
            });
        });
        return result;
    };

    Rule.prototype.clone = function () {
        return new Rule(extend([], this.selectors), extend({}, this.body));
    };

    Rule.prototype.resolveBody = function (seed, key, body) {
        var _this = this;
        Object.keys(body).forEach(function (k2) {
            var k1 = key || '';
            key = s.dasherize(_this.combineKeys(k1, k2));
            var value = _this.resolveOverride(key, body[k2]);
            if (typeof value === 'undefined') {
                return;
            }
            if (_this.isDeclarationValue(value)) {
                seed.push([key, _this.compileDeclarationValue(value)]);
            } else {
                _this.resolveBody(seed, key, value);
            }
            key = k1;
        });
        return seed;
    };

    Rule.prototype.resolveOverride = function (key, value) {
        var override = this.config.overrides[s.camelize(key)];
        switch (typeof override) {
            case 'function':
                var fn;
                if (Array.isArray(value)) {
                    fn = override(value[0], value[1]);
                } else {
                    fn = override(value);
                }
                if (typeof fn !== 'function') {
                    throw new Error('Override "' + key + '" must return a function');
                }
                return fn(this.config);
            case 'undefined':
                return value;
            default:
                throw new Error('Override "' + key + '" must be of type: Function');
        }
    };

    Rule.prototype.combineKeys = function (k1, k2) {
        if (k1 !== '' && k2[0] !== ':') {
            return k1 + '-' + k2;
        }
        return k1 + k2;
    };

    Rule.prototype.isDeclarationValue = function (value) {
        if (Array.isArray(value)) {
            return true;
        }
        switch (typeof value) {
            case 'string':
            case 'number':
            case 'function':
                return true;
        }
        return false;
    };

    Rule.prototype.compileDeclarationValue = function (value) {
        if (Array.isArray(value)) {
            return this.compileArray(value);
        }
        return this.compilePrimitive(value);
    };

    Rule.prototype.compileArray = function (arr) {
        var _this = this;
        return arr.map(function (primitive) {
            return _this.compilePrimitive(primitive);
        }).join(' ');
    };

    Rule.prototype.compilePrimitive = function (value) {
        switch (typeof value) {
            case 'number':
                if (value === 0) {
                    return '0';
                }
                return value + 'px';
            case 'function':
                return this.compilePrimitive(value(this.config));
            case 'string':
                if (value === '') {
                    return s.repeat(this.config.quote, 2);
                }
                if (value.indexOf(' ') > -1) {
                    var quote = this.config.quote;
                    return quote + value.replace(new RegExp(quote, 'g'), '\\' + quote) + quote;
                }
        }
        return value;
    };

    Rule.prototype.compile = function (config) {
        return new Formatter().format(config, this.resolve(config));
    };
    return Rule;
})();

module.exports = Rule;

var extend = require('node.extend');
var Formatter = require('./Formatter');
var s = require('./helpers/string');
var Rule = (function () {
    function Rule(selectors, body) {
        this.body = body;
        this._selectors = [];
        if (Array.isArray(selectors)) {
            this.selectors = selectors;
        }
        else {
            this.selectors = this.splitSelectors(selectors);
        }
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
        var body = this.clone().body;
        var rules = this.resolveTree(this.selectors.join(), body);
        return Object.keys(rules).map(function (key) {
            return [_this.splitSelectors(key), rules[key]];
        });
    };
    Rule.prototype.clone = function () {
        return new Rule(extend([], this.selectors), extend({}, this.body));
    };
    Rule.prototype.resolveTree = function (selectors, body, seed, key) {
        var _this = this;
        seed = seed || {};
        key = key || '';
        Object.keys(body).forEach(function (k2) {
            if (k2 === 'respond') {
                _this.resolveResponders(selectors, body.respond, seed);
                return;
            }
            if (k2[0] === ':') {
                _this.resolveTree(_this.joinSelectors(selectors, k2), body[k2], seed);
                return;
            }
            var joinedKey = _this.combineKeys(key, k2);
            var overrideKey = s.camelize(joinedKey);
            if (_this.config.overrides.hasOwnProperty(overrideKey)) {
                _this.resolveOverride(overrideKey, selectors, seed, body[k2]);
                return;
            }
            var value = body[k2];
            if (_this.isDeclarationValue(value)) {
                seed[selectors] = seed[selectors] || [];
                seed[selectors].push([
                    s.dasherize(joinedKey),
                    _this.compileDeclarationValue(value)
                ]);
                return;
            }
            _this.resolveTree(selectors, value, seed, joinedKey);
        });
        return seed;
    };
    Rule.prototype.resolveResponders = function (selectors, body, seed) {
        var _this = this;
        Object.keys(body).forEach(function (condition) {
            var mediaQuery = '@media ' + condition;
            var resolved = _this.resolveTree(selectors, body[condition]);
            var keys = Object.keys(resolved);
            if (keys.length === 0) {
                return;
            }
            seed[mediaQuery] = keys.map(function (key) {
                return [_this.splitSelectors(key), resolved[key]];
            });
        });
    };
    Rule.prototype.joinSelectors = function (left, right) {
        var _this = this;
        var result = [];
        this.splitSelectors(left).forEach(function (s1) {
            _this.splitSelectors(right).forEach(function (s2) {
                result.push(s1 + s2);
            });
        });
        return result.join();
    };
    Rule.prototype.combineKeys = function (k1, k2) {
        if (k1 !== '' && k2[0] !== ':') {
            return k1 + '-' + k2;
        }
        return k1 + k2;
    };
    Rule.prototype.resolveOverride = function (overrideKey, selectors, seed, value) {
        var _this = this;
        var override = this.config.overrides[overrideKey];
        if (typeof override !== 'function') {
            throw new Error('Override "' + overrideKey + '" must be of type: Function');
        }
        var fn;
        if (Array.isArray(value)) {
            fn = override(value[0], value[1]);
        }
        else {
            fn = override(value);
        }
        if (typeof fn !== 'function') {
            throw new Error('Override "' + overrideKey + '" must return a function');
        }
        var result = fn(this.config);
        if (Array.isArray(result)) {
            seed[selectors] = result;
            return;
        }
        Object.keys(result).forEach(function (key) {
            seed[_this.joinSelectors(selectors, key)] = result[key];
        });
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

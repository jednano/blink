!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.blink=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var _Block = require('../Block');

var _Compiler = require('./Compiler');

var _Element = require('../Element');

var _MediaAtRule = require('../MediaAtRule');
var _Modifier = require('../Modifier');

var _Rule = require('../Rule');

var Configuration = require('./Configuration');

var Blink;
(function (Blink) {
    Blink.config = new Configuration();

    function compile(contents, callback, options) {
        var compiler = new Compiler(new Configuration(options || {}));
        compiler.compile(contents, callback);
    }
    Blink.compile = compile;

    var Compiler = (function (_super) {
        __extends(Compiler, _super);
        function Compiler() {
            _super.apply(this, arguments);
        }
        return Compiler;
    })(_Compiler);
    Blink.Compiler = Compiler;
    var Rule = (function (_super) {
        __extends(Rule, _super);
        function Rule() {
            _super.apply(this, arguments);
        }
        return Rule;
    })(_Rule);
    Blink.Rule = Rule;
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block() {
            _super.apply(this, arguments);
        }
        return Block;
    })(_Block);
    Blink.Block = Block;
    var Element = (function (_super) {
        __extends(Element, _super);
        function Element() {
            _super.apply(this, arguments);
        }
        return Element;
    })(_Element);
    Blink.Element = Element;
    var MediaAtRule = (function (_super) {
        __extends(MediaAtRule, _super);
        function MediaAtRule() {
            _super.apply(this, arguments);
        }
        return MediaAtRule;
    })(_MediaAtRule);
    Blink.MediaAtRule = MediaAtRule;
    var Modifier = (function (_super) {
        __extends(Modifier, _super);
        function Modifier() {
            _super.apply(this, arguments);
        }
        return Modifier;
    })(_Modifier);
    Blink.Modifier = Modifier;
})(Blink || (Blink = {}));

module.exports = Blink;

},{"../Block":3,"../Element":4,"../MediaAtRule":7,"../Modifier":8,"../Rule":9,"./Compiler":10,"./Configuration":11}],2:[function(require,module,exports){
module.exports={
  "quiet": false,
  "trace": false,
  "force": false,
  "boring": false,

  "style": "nested",
  "oneIndent": "2s",
  "newline": "lf",
  "quote": "double",

  "block": ".%s",
  "element": "__%s",
  "modifier": "--%s",

  "chrome": 0,
  "firefox": 0,
  "ie": 0,
  "opera": 0,

  "webkitPrefix": true,
  "khtmlPrefix": false,
  "mozPrefix": true,
  "msPrefix": true,
  "oPrefix": true
}

},{}],3:[function(require,module,exports){
var Rule = require('./Rule');

var Block = (function () {
    function Block(name, body) {
        this.name = name;
        this.body = body;
    }
    Object.defineProperty(Block.prototype, "elements", {
        get: function () {
            return this.body.elements || [];
        },
        set: function (value) {
            this.body.elements = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Block.prototype, "modifiers", {
        get: function () {
            return this.body.modifiers || [];
        },
        set: function (value) {
            this.body.modifiers = value;
        },
        enumerable: true,
        configurable: true
    });


    Block.prototype.resolve = function (config) {
        var elements = this.elements;
        delete this.body.elements;
        var modifiers = this.modifiers;
        delete this.body.modifiers;
        var selector = config.block.replace('%s', this.name);
        var resolved = new Rule(selector, this.body).resolve(config);
        this.elements = elements;
        this.modifiers = modifiers;

        elements.forEach(function (element) {
            [].push.apply(resolved, element.resolve(selector, config));
        });
        modifiers.forEach(function (modifier) {
            [].push.apply(resolved, modifier.resolve(selector, config));
        });

        return resolved;
    };
    return Block;
})();

module.exports = Block;

},{"./Rule":9}],4:[function(require,module,exports){
var Rule = require('./Rule');

var Element = (function () {
    function Element(name, body) {
        this.name = name;
        this.body = body;
    }
    Object.defineProperty(Element.prototype, "modifiers", {
        get: function () {
            return this.body.modifiers || [];
        },
        set: function (value) {
            this.body.modifiers = value;
        },
        enumerable: true,
        configurable: true
    });


    Element.prototype.resolve = function (base, config) {
        var modifiers = this.modifiers;
        delete this.body.modifiers;
        var selector = base + config.element.replace('%s', this.name);
        var resolved = new Rule(selector, this.body).resolve(config);
        this.modifiers = modifiers;

        modifiers.forEach(function (modifier) {
            [].push.apply(resolved, modifier.resolve(selector, config));
        });

        return resolved;
    };
    return Element;
})();

module.exports = Element;

},{"./Rule":9}],5:[function(require,module,exports){
var ExtenderRegistry = (function () {
    function ExtenderRegistry() {
        this.extenders = {};
        this.selectors = {};
    }
    ExtenderRegistry.prototype.add = function (extender, selectors) {
        var key = this.createKey(extender);
        if (!this.extenders.hasOwnProperty(key)) {
            this.extenders[key] = extender;
            this.selectors[key] = [];
        }
        Array.prototype.push.apply(this.selectors[key], selectors);
    };

    ExtenderRegistry.prototype.createKey = function (extender) {
        var args = extender.args;
        var extenderName = args.callee.name;
        var serializedArgs = JSON.stringify(Array.prototype.slice.call(args, 0));
        return extenderName + serializedArgs;
    };

    ExtenderRegistry.prototype.forEach = function (callback) {
        var _this = this;
        Object.keys(this.extenders).forEach(function (key) {
            callback(_this.extenders[key], _this.selectors[key]);
        });
    };

    ExtenderRegistry.prototype.map = function (callback) {
        var result = [];
        this.forEach(function (extender, selectors) {
            result.push(callback(extender, selectors));
        });
        return result;
    };
    return ExtenderRegistry;
})();

module.exports = ExtenderRegistry;

},{}],6:[function(require,module,exports){
var s = require('./helpers/string');

var Formatter = (function () {
    function Formatter() {
    }
    Formatter.prototype.format = function (config, rules) {
        this.config = config;
        return this.formatRules(rules, 0);
    };

    Formatter.prototype.formatRules = function (rules, level) {
        var _this = this;
        return rules.map(function (rule) {
            return _this.formatRule(rule, level);
        }).join('');
    };

    Formatter.prototype.formatRule = function (rule, level) {
        var config = this.config;
        var selectors = rule[0].join(',' + config.oneSpace);
        var body = this.formatBody(rule[1], level + 1);
        var indent = s.repeat(config.oneIndent, level);
        var css = indent + selectors + config.oneSpace + '{' + config.newline;
        css += body;
        css += indent + '}' + config.newline;
        return css;
    };

    Formatter.prototype.formatBody = function (body, level) {
        var firstPair = body[0];
        if (!firstPair || !firstPair.length) {
            return '';
        }

        var firstKey = firstPair[0];
        if (!firstKey) {
            return '';
        }

        var firstVal = firstPair[1];

        if (firstKey[0] === '@' || !this.isDeclarationValue(firstVal)) {
            return this.formatRules(body, level);
        }

        return this.formatDeclarations(body, level);
    };

    Formatter.prototype.isDeclarationValue = function (value) {
        return typeof value === 'string';
    };

    Formatter.prototype.formatDeclarations = function (decs, level) {
        var _this = this;
        var indent = s.repeat(this.config.oneIndent, level);
        return decs.map(function (dec) {
            var prop = dec[0];
            var val = dec[1];
            var css = indent;
            css += prop + ':' + _this.config.oneSpace;
            css += _this.formatValue(val) + ';';
            return css;
        }).join(this.config.declarationSeparator) + this.config.newline;
    };

    Formatter.prototype.formatValue = function (value) {
        if (typeof value === 'string') {
            if (value === '') {
                return '""';
            }
            return value;
        }
        return value.join(' ');
    };
    return Formatter;
})();

module.exports = Formatter;

},{"./helpers/string":20}],7:[function(require,module,exports){
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

},{"./Rule":9}],8:[function(require,module,exports){
var Rule = require('./Rule');

var Modifier = (function () {
    function Modifier(name, body) {
        this.name = name;
        this.body = body;
    }
    Object.defineProperty(Modifier.prototype, "elements", {
        get: function () {
            return this.body.elements || [];
        },
        set: function (value) {
            this.body.elements = value;
        },
        enumerable: true,
        configurable: true
    });


    Modifier.prototype.resolve = function (base, config) {
        var elements = this.elements;
        delete this.body.elements;
        var selector = base + config.modifier.replace('%s', this.name);
        var resolved = new Rule(selector, this.body).resolve(config);
        this.elements = elements;

        this.elements.forEach(function (element) {
            [].push.apply(resolved, element.resolve(selector, config));
        });

        return resolved;
    };
    return Modifier;
})();

module.exports = Modifier;

},{"./Rule":9}],9:[function(require,module,exports){
var extend = require('node.extend');

var Formatter = require('./Formatter');

var s = require('./helpers/string');

var Rule = (function () {
    function Rule(selectors, body) {
        this.body = body;
        this.selectors = selectors;
    }
    Object.defineProperty(Rule.prototype, "extenders", {
        get: function () {
            return this.body.extend;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Rule.prototype, "includes", {
        get: function () {
            return this.body.include;
        },
        enumerable: true,
        configurable: true
    });

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
        delete body.extend;
        delete body.include;
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

        var includes = this.resolveIncludes();
        var resolvedBody = extend(includes, this.resolveBody([], '', body));
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

    Rule.prototype.resolveIncludes = function () {
        var _this = this;
        var includes = this.includes;
        if (!includes || !includes.length) {
            return [];
        }
        var result = [];
        includes.forEach(function (fn) {
            var decs = fn(_this.config);
            if (typeof decs === 'function') {
                decs = decs(_this.config);
            }
            if (!decs.length) {
                return;
            }
            [].push.apply(result, decs.map(function (dec) {
                return [dec[0], _this.compileDeclarationValue(dec[1])];
            }));
        });
        return result;
    };

    Rule.prototype.resolveBody = function (seed, key, body) {
        var _this = this;
        Object.keys(body).forEach(function (k2) {
            var k1 = key || '';
            key = s.dasherize(_this.combineKeys(k1, k2));
            var value = body[k2];
            if (_this.isDeclarationValue(value)) {
                seed.push([key, _this.compileDeclarationValue(value)]);
            } else {
                _this.resolveBody(seed, key, value);
            }
            key = k1;
        });
        return seed;
    };

    Rule.prototype.combineKeys = function (k1, k2) {
        if (k1 !== '' && k2[0] !== ':') {
            return k1 + '-' + k2;
        }
        return k1 + k2;
    };

    Rule.prototype.isDeclarationValue = function (value) {
        if (value instanceof Array) {
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
        if (value instanceof Array) {
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
            case 'string':
                if (value.indexOf(' ') > -1) {
                    var quote = this.config.quote;
                    return quote + value.replace(new RegExp(quote, 'g'), '\\' + quote) + quote;
                }
                return value;
            case 'number':
                return value ? value + 'px' : value;
            case 'function':
                return this.compilePrimitive(value(this.config));
            default:
                throw new Error('Unexpected type: ' + typeof value);
        }
    };

    Rule.prototype.compile = function (config) {
        return new Formatter().format(config, this.resolve(config));
    };
    return Rule;
})();

module.exports = Rule;

},{"./Formatter":6,"./helpers/string":20,"node.extend":27}],10:[function(require,module,exports){
var a = require('../helpers/array');

var Configuration = require('./Configuration');
var ExtenderRegistry = require('../ExtenderRegistry');
var Formatter = require('../Formatter');

var Rule = require('../Rule');
var s = require('../helpers/string');

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
        rules = a.flatten([rules]);
        this.compileRules(rules, callback);
    };

    Compiler.prototype.compileRules = function (rules, callback) {
        try  {
            var resolved = this.resolveRules(rules);
            var formatted = new Formatter().format(this.config, resolved);
            callback(null, formatted);
        } catch (err) {
            callback(err);
        }
    };

    Compiler.prototype.resolveRules = function (rules) {
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

    Compiler.prototype.format = function (rules) {
        return new Formatter().format(this.config, rules);
    };

    Compiler.prototype.resolveExtenders = function (rules) {
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

    Compiler.prototype.registerExtenders = function (extenders, rules) {
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

    Compiler.prototype.resolveTree = function (tree) {
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
    return Compiler;
})();

module.exports = Compiler;

},{"../ExtenderRegistry":5,"../Formatter":6,"../Rule":9,"../helpers/array":19,"../helpers/string":20,"./Configuration":11}],11:[function(require,module,exports){
var extend = require('node.extend');

var _extenders = require('../extenders/all');
var _overrides = require('../overrides/all');

var s = require('../helpers/string');

var ONE_INDENT = /(\d+)([st])/;

var styles = {
    nested: null,
    expanded: null,
    compact: null,
    compressed: null
};

var newlines = {
    lf: '\n',
    crlf: '\r\n'
};

var quotes = {
    'double': '"',
    'single': "'"
};

var Configuration = (function () {
    function Configuration(options) {
        this.raw = {};
        this.set(require('../../defaults.browser.json'));
        var extended = this.loadPlugins(options);
        var clonedOptions = extend({}, options || {});
        delete clonedOptions.plugins;
        extended.set(clonedOptions);
        return extended;
    }
    Configuration.prototype.loadPlugins = function (options) {
        var _this = this;
        if (!options) {
            return this;
        }
        var result = this;
        (options.plugins || []).forEach(function (pluginName) {
            try  {
                var plugin = require(pluginName);
            } catch (err) {
                throw new Error('Invalid plugin. Node module not found: ' + pluginName);
            }
            result = plugin(_this);
        });
        return result;
    };

    Configuration.prototype.clone = function () {
        var clone = new Configuration(this.raw);
        clone.overrides = this.overrides;
        return clone;
    };

    Configuration.prototype.set = function (options) {
        extend(this.raw, options || {});
        return this;
    };

    Configuration.prototype.toString = function () {
        return JSON.stringify(this.raw);
    };

    Object.defineProperty(Configuration.prototype, "config", {
        get: function () {
            return this.raw.config;
        },
        set: function (path) {
            this.raw.config = path;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "quiet", {
        get: function () {
            return this.raw.quiet;
        },
        set: function (value) {
            this.raw.quiet = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "trace", {
        get: function () {
            return this.raw.trace;
        },
        set: function (value) {
            this.raw.trace = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "force", {
        get: function () {
            return this.raw.force;
        },
        set: function (value) {
            this.raw.force = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "boring", {
        get: function () {
            return this.raw.boring;
        },
        set: function (value) {
            this.raw.boring = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "style", {
        get: function () {
            return this.raw.style;
        },
        set: function (value) {
            value = value.toLowerCase();
            if (!styles.hasOwnProperty(value)) {
                throw new Error('Unsupported style: ' + value);
            }
            this.raw.style = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "oneIndent", {
        get: function () {
            switch (this.style) {
                case 'compact':
                case 'compressed':
                    return '';
                default:
                    if (this.raw.oneIndent === '0') {
                        return '';
                    }
                    var m = this.raw.oneIndent.match(ONE_INDENT);
                    return s.repeat({ s: ' ', t: '\t' }[m[2]], parseInt(m[1], 10));
            }
        },
        set: function (value) {
            if (value.toString()[0] === '0') {
                this.raw.oneIndent = '0';
                return;
            }
            value = value.toString().toLowerCase();
            if (!ONE_INDENT.test(value)) {
                throw new Error('Unsupported oneIndent format: ' + value);
            }
            this.raw.oneIndent = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "newline", {
        get: function () {
            switch (this.style) {
                case 'compact':
                case 'compressed':
                    return '';
                default:
                    return newlines[this.raw.newline];
            }
        },
        set: function (value) {
            value = value.toLowerCase();
            if (!newlines.hasOwnProperty(value)) {
                throw new Error('Unsupported newline: ' + value);
            }
            this.raw.newline = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "quote", {
        get: function () {
            return quotes[this.raw.quote];
        },
        set: function (value) {
            value = value.toLowerCase();
            if (!quotes.hasOwnProperty(value)) {
                throw new Error('Unsupported quote type: ' + value);
            }
            this.raw.quote = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "oneSpace", {
        get: function () {
            return (this.style === 'compressed') ? '' : ' ';
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Configuration.prototype, "declarationSeparator", {
        get: function () {
            switch (this.style) {
                case 'compact':
                    return ' ';
                case 'compressed':
                    return '';
                default:
                    return this.newline;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Configuration.prototype, "ruleSeparator", {
        get: function () {
            switch (this.style) {
                case 'compact':
                    return newlines[this.raw.newline];
                case 'compressed':
                    return '';
                default:
                    return this.newline;
            }
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Configuration.prototype, "block", {
        get: function () {
            return this.raw.block;
        },
        set: function (value) {
            if (value.indexOf('%s') === -1) {
                throw new Error('Invalid block format. Expected "%s".');
            }
            this.raw.block = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "element", {
        get: function () {
            return this.raw.element;
        },
        set: function (value) {
            if (value.indexOf('%s') === -1) {
                throw new Error('Invalid element format. Expected "%s".');
            }
            this.raw.element = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "modifier", {
        get: function () {
            return this.raw.modifier;
        },
        set: function (value) {
            if (value.indexOf('%s') === -1) {
                throw new Error('Invalid modifier format. Expected "%s".');
            }
            this.raw.modifier = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "chrome", {
        get: function () {
            return this.raw.chrome;
        },
        set: function (value) {
            if (typeof value !== 'number') {
                throw new Error('Invalid Chrome version. Expected number.');
            }
            this.raw.chrome = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "firefox", {
        get: function () {
            return this.raw.firefox;
        },
        set: function (value) {
            if (typeof value !== 'number') {
                throw new Error('Invalid Firefox version. Expected number.');
            }
            this.raw.firefox = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "ie", {
        get: function () {
            return this.raw.ie;
        },
        set: function (value) {
            if (typeof value !== 'number') {
                throw new Error('Invalid IE version. Expected number.');
            }
            this.raw.ie = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "opera", {
        get: function () {
            return this.raw.opera;
        },
        set: function (value) {
            if (typeof value !== 'number') {
                throw new Error('Invalid Opera version. Expected number.');
            }
            this.raw.opera = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "webkitPrefix", {
        get: function () {
            return this.raw.webkitPrefix;
        },
        set: function (value) {
            this.raw.webkitPrefix = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "khtmlPrefix", {
        get: function () {
            return this.raw.khtmlPrefix;
        },
        set: function (value) {
            this.raw.khtmlPrefix = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "mozPrefix", {
        get: function () {
            return this.raw.mozPrefix;
        },
        set: function (value) {
            this.raw.mozPrefix = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "msPrefix", {
        get: function () {
            return this.raw.msPrefix;
        },
        set: function (value) {
            this.raw.msPrefix = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "oPrefix", {
        get: function () {
            return this.raw.oPrefix;
        },
        set: function (value) {
            this.raw.oPrefix = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "extenders", {
        get: function () {
            return _extenders;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Configuration.prototype, "overrides", {
        get: function () {
            return _overrides;
        },
        enumerable: true,
        configurable: true
    });
    return Configuration;
})();

module.exports = Configuration;

},{"../../defaults.browser.json":2,"../extenders/all":12,"../helpers/string":20,"../overrides/all":21,"node.extend":27}],12:[function(require,module,exports){
var background = require('./background');
var clearfix = require('./clearfix');
var experimental = require('./experimental');
var font = require('./font');
var inlineBlock = require('./inlineBlock');

// ReSharper disable once UnusedLocals
var extenders = {
    background: background,
    clearfix: clearfix,
    experimental: experimental,
    font: font,
    inlineBlock: inlineBlock
};

module.exports = extenders;

},{"./background":13,"./clearfix":14,"./experimental":15,"./font":16,"./inlineBlock":17}],13:[function(require,module,exports){
// ReSharper disable once UnusedLocals
function background(options) {
    options = options || {};

    var extender = (function () {
        var values = [];

        ['color', 'image', 'repeat', 'attachment', 'position'].forEach(function (prop) {
            if (options.hasOwnProperty(prop)) {
                values.push(options[prop]);
            }
        });

        if (values.length) {
            return [['background', values]];
        }

        return [];
    });

    extender.args = arguments;
    return extender;
}

module.exports = background;

},{}],14:[function(require,module,exports){
// ReSharper disable once UnusedLocals
function clearfix() {
    var extender = (function () {
        return [
            ['content', ''],
            ['display', 'table'],
            ['clear', 'both']
        ];
    });

    extender.args = arguments;
    extender.selectors = [':after'];

    return extender;
}

module.exports = clearfix;

},{}],15:[function(require,module,exports){
// ReSharper disable once UnusedLocals
function experimental(property, value, options) {
    options = options || {};

    var extender = (function (config) {
        var decs = [];
        ['webkit', 'khtml', 'moz', 'ms', 'o'].forEach(function (vendor) {
            if (options[vendor] && config[vendor + 'Prefix']) {
                decs.push(['-' + vendor + '-' + property, value]);
            }
        });
        if (options.official) {
            decs.push([property, value]);
        }
        return decs;
    });

    extender.args = arguments;
    return extender;
}

module.exports = experimental;

},{}],16:[function(require,module,exports){
// ReSharper disable once UnusedLocals
function font(options) {
    options = options || {};

    var extender = (function () {
        var values = [];

        ['style', 'variant', 'weight'].forEach(function (prop) {
            if (options.hasOwnProperty(prop)) {
                values.push(options[prop]);
            }
        });

        if (options.hasOwnProperty('size')) {
            if (options.hasOwnProperty('lineHeight')) {
                values.push(options.size + '/' + options.lineHeight);
            } else {
                values.push(options.size);
            }
            return [['font', values]];
        }

        var decs = [];

        if (options.hasOwnProperty('lineHeight')) {
            decs.push(['line-height', options.lineHeight]);
        }

        if (values.length) {
            decs.unshift(['font', values]);
        }

        return decs;
    });

    extender.args = arguments;
    return extender;
}

module.exports = font;

},{}],17:[function(require,module,exports){
// ReSharper disable once UnusedLocals
function inlineBlock(options) {
    options = options || {};

    var extender = (function (config) {
        var decs = [];

        if (config.firefox < 3) {
            decs.push(['display', '-moz-inline-stack']);
        }

        decs.push(['display', 'inline-block']);

        if (options.verticalAlign !== null) {
            decs.push(['vertical-align', options.verticalAlign || 'middle']);
        }

        if (config.ie < 8) {
            decs.push(['*vertical-align', 'auto']);
            decs.push(['zoom', '1']);
            decs.push(['*display', 'inline']);
        }

        return decs;
    });

    extender.args = arguments;
    return extender;
}

module.exports = inlineBlock;

},{}],18:[function(require,module,exports){
// ReSharper disable once UnusedLocals
function noop() {
    var extender = (function () {
        return [];
    });
    extender.args = arguments;
    return extender;
}

module.exports = noop;

},{}],19:[function(require,module,exports){
function flatten(arr) {
    var flat = [];
    arr.forEach(function (item) {
        if (item.forEach) {
            [].push.apply(flat, exports.flatten(item));
            return;
        }
        flat.push(item);
    });
    return flat;
}
exports.flatten = flatten;

},{}],20:[function(require,module,exports){
// ReSharper disable InconsistentNaming
var STRING_CAMELIZE = (/(\-|_|\.|\s)+(.)?/g);
var STRING_DASHERIZE = /[ _]/g;
var STRING_DASHERIZE_CACHE = {};
var STRING_DECAMELIZE = /([a-z\d])([A-Z])/g;

// ReSharper restore InconsistentNaming
function repeat(s, n) {
    return new Array(n + 1).join(s);
}
exports.repeat = repeat;
;

/**
Returns the LowerCamelCase form of a string.
*/
function camelize(s) {
    return s.replace(STRING_CAMELIZE, function (match, separator, chr) {
        return chr ? chr.toUpperCase() : '';
    }).replace(/^([A-Z])/, function (match) {
        return match.toLowerCase();
    });
}
exports.camelize = camelize;

/**
Replaces underscores, spaces, or camelCase with dashes.
*/
function dasherize(s) {
    var cache = STRING_DASHERIZE_CACHE;
    var hit = cache.hasOwnProperty(s);

    if (hit) {
        return cache[s];
    }

    return cache[s] = exports.decamelize(s).replace(STRING_DASHERIZE, '-');
}
exports.dasherize = dasherize;

/**
Converts a camelized string into all lower case separated by underscores.
*/
function decamelize(s) {
    return s.replace(STRING_DECAMELIZE, '$1_$2').toLowerCase();
}
exports.decamelize = decamelize;

},{}],21:[function(require,module,exports){
var background = require('./background');
var boxSizing = require('./boxSizing');
var clearfix = require('./clearfix');
var display = require('./display');
var font = require('./font');

// ReSharper disable once UnusedLocals
var overrides = {
    background: background,
    boxSizing: boxSizing,
    clearfix: clearfix,
    display: display,
    font: font
};

module.exports = overrides;

},{"./background":22,"./boxSizing":23,"./clearfix":24,"./display":25,"./font":26}],22:[function(require,module,exports){
var _background = require('../extenders/background');

// ReSharper disable once UnusedLocals
function background(value) {
    var override = (function () {
        return _background(value)();
    });

    override.args = arguments;
    return override;
}

module.exports = background;

},{"../extenders/background":13}],23:[function(require,module,exports){
var experimental = require('../extenders/experimental');

// http://css-tricks.com/box-sizing/
// ReSharper disable once UnusedLocals
function boxSizing(value) {
    var override = (function (config) {
        return experimental('box-sizing', value, {
            official: true,
            webkit: true,
            moz: true
        })(config);
    });

    override.args = arguments;
    return override;
}

module.exports = boxSizing;

},{"../extenders/experimental":15}],24:[function(require,module,exports){
var _clearfix = require('../extenders/clearfix');
var noop = require('../extenders/noop');

// ReSharper disable once UnusedLocals
function clearfix(value) {
    return value ? _clearfix() : noop();
}

module.exports = clearfix;

},{"../extenders/clearfix":14,"../extenders/noop":18}],25:[function(require,module,exports){
var inlineBlock = require('../extenders/inlineBlock');

// ReSharper disable once UnusedLocals
function display(value) {
    var override = (function (config) {
        switch (value) {
            case 'inline-block':
                return inlineBlock()(config);
            default:
                return [['display', value]];
        }
    });

    override.args = arguments;
    return override;
}

module.exports = display;

},{"../extenders/inlineBlock":17}],26:[function(require,module,exports){
var _font = require('../extenders/font');

// ReSharper disable once UnusedLocals
function font(value) {
    var override = (function () {
        if (typeof value === 'string') {
            return [['font', value]];
        }
        return _font(value)();
    });

    override.args = arguments;
    return override;
}

module.exports = font;

},{"../extenders/font":16}],27:[function(require,module,exports){
module.exports = require('./lib/extend');


},{"./lib/extend":28}],28:[function(require,module,exports){
/*!
 * node.extend
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * @fileoverview
 * Port of jQuery.extend that actually works on node.js
 */
var is = require('is');

function extend() {
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false;
  var options, name, src, copy, copy_is_array, clone;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !is.fn(target)) {
    target = {};
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    options = arguments[i]
    if (options != null) {
      if (typeof options === 'string') {
          options = options.split('');
      }
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
          if (copy_is_array) {
            copy_is_array = false;
            clone = src && is.array(src) ? src : [];
          } else {
            clone = src && is.hash(src) ? src : {};
          }

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);

        // Don't bring in undefined values
        } else if (typeof copy !== 'undefined') {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

/**
 * @public
 */
extend.version = '1.0.8';

/**
 * Exports module.
 */
module.exports = extend;


},{"is":29}],29:[function(require,module,exports){

/**!
 * is
 * the definitive JavaScript type testing library
 *
 * @copyright 2013-2014 Enrico Marino / Jordan Harband
 * @license MIT
 */

var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toString = objProto.toString;
var isActualNaN = function (value) {
  return value !== value;
};
var NON_HOST_TYPES = {
  boolean: 1,
  number: 1,
  string: 1,
  undefined: 1
};

/**
 * Expose `is`
 */

var is = module.exports = {};

/**
 * Test general.
 */

/**
 * is.type
 * Test if `value` is a type of `type`.
 *
 * @param {Mixed} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */

is.a =
is.type = function (value, type) {
  return typeof value === type;
};

/**
 * is.defined
 * Test if `value` is defined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */

is.defined = function (value) {
  return value !== undefined;
};

/**
 * is.empty
 * Test if `value` is empty.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */

is.empty = function (value) {
  var type = toString.call(value);
  var key;

  if ('[object Array]' === type || '[object Arguments]' === type || '[object String]' === type) {
    return value.length === 0;
  }

  if ('[object Object]' === type) {
    for (key in value) {
      if (owns.call(value, key)) { return false; }
    }
    return true;
  }

  return false;
};

/**
 * is.equal
 * Test if `value` is equal to `other`.
 *
 * @param {Mixed} value value to test
 * @param {Mixed} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */

is.equal = function (value, other) {
  var strictlyEqual = value === other;
  if (strictlyEqual) {
    return true;
  }

  var type = toString.call(value);
  var key;

  if (type !== toString.call(other)) {
    return false;
  }

  if ('[object Object]' === type) {
    for (key in value) {
      if (!is.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!is.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }

  if ('[object Array]' === type) {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (--key) {
      if (!is.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  if ('[object Function]' === type) {
    return value.prototype === other.prototype;
  }

  if ('[object Date]' === type) {
    return value.getTime() === other.getTime();
  }

  return strictlyEqual;
};

/**
 * is.hosted
 * Test if `value` is hosted by `host`.
 *
 * @param {Mixed} value to test
 * @param {Mixed} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */

is.hosted = function (value, host) {
  var type = typeof host[value];
  return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * is.instance
 * Test if `value` is an instance of `constructor`.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */

is.instance = is['instanceof'] = function (value, constructor) {
  return value instanceof constructor;
};

/**
 * is.nil / is.null
 * Test if `value` is null.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */

is.nil = is['null'] = function (value) {
  return value === null;
};

/**
 * is.undef / is.undefined
 * Test if `value` is undefined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */

is.undef = is['undefined'] = function (value) {
  return value === undefined;
};

/**
 * Test arguments.
 */

/**
 * is.args
 * Test if `value` is an arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.args = is['arguments'] = function (value) {
  var isStandardArguments = '[object Arguments]' === toString.call(value);
  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
  return isStandardArguments || isOldArguments;
};

/**
 * Test array.
 */

/**
 * is.array
 * Test if 'value' is an array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */

is.array = function (value) {
  return '[object Array]' === toString.call(value);
};

/**
 * is.arguments.empty
 * Test if `value` is an empty arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
is.args.empty = function (value) {
  return is.args(value) && value.length === 0;
};

/**
 * is.array.empty
 * Test if `value` is an empty array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
is.array.empty = function (value) {
  return is.array(value) && value.length === 0;
};

/**
 * is.arraylike
 * Test if `value` is an arraylike object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.arraylike = function (value) {
  return !!value && !is.boolean(value)
    && owns.call(value, 'length')
    && isFinite(value.length)
    && is.number(value.length)
    && value.length >= 0;
};

/**
 * Test boolean.
 */

/**
 * is.boolean
 * Test if `value` is a boolean.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */

is.boolean = function (value) {
  return '[object Boolean]' === toString.call(value);
};

/**
 * is.false
 * Test if `value` is false.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is false, false otherwise
 * @api public
 */

is['false'] = function (value) {
  return is.boolean(value) && Boolean(Number(value)) === false;
};

/**
 * is.true
 * Test if `value` is true.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */

is['true'] = function (value) {
  return is.boolean(value) && Boolean(Number(value)) === true;
};

/**
 * Test date.
 */

/**
 * is.date
 * Test if `value` is a date.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */

is.date = function (value) {
  return '[object Date]' === toString.call(value);
};

/**
 * Test element.
 */

/**
 * is.element
 * Test if `value` is an html element.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */

is.element = function (value) {
  return value !== undefined
    && typeof HTMLElement !== 'undefined'
    && value instanceof HTMLElement
    && value.nodeType === 1;
};

/**
 * Test error.
 */

/**
 * is.error
 * Test if `value` is an error object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */

is.error = function (value) {
  return '[object Error]' === toString.call(value);
};

/**
 * Test function.
 */

/**
 * is.fn / is.function (deprecated)
 * Test if `value` is a function.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */

is.fn = is['function'] = function (value) {
  var isAlert = typeof window !== 'undefined' && value === window.alert;
  return isAlert || '[object Function]' === toString.call(value);
};

/**
 * Test number.
 */

/**
 * is.number
 * Test if `value` is a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */

is.number = function (value) {
  return '[object Number]' === toString.call(value);
};

/**
 * is.infinite
 * Test if `value` is positive or negative infinity.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
is.infinite = function (value) {
  return value === Infinity || value === -Infinity;
};

/**
 * is.decimal
 * Test if `value` is a decimal number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */

is.decimal = function (value) {
  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
};

/**
 * is.divisibleBy
 * Test if `value` is divisible by `n`.
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */

is.divisibleBy = function (value, n) {
  var isDividendInfinite = is.infinite(value);
  var isDivisorInfinite = is.infinite(n);
  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
  return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
};

/**
 * is.int
 * Test if `value` is an integer.
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */

is.int = function (value) {
  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
};

/**
 * is.maximum
 * Test if `value` is greater than 'others' values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */

is.maximum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value < others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.minimum
 * Test if `value` is less than `others` values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */

is.minimum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value > others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.nan
 * Test if `value` is not a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */

is.nan = function (value) {
  return !is.number(value) || value !== value;
};

/**
 * is.even
 * Test if `value` is an even number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */

is.even = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
};

/**
 * is.odd
 * Test if `value` is an odd number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */

is.odd = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
};

/**
 * is.ge
 * Test if `value` is greater than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.ge = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value >= other;
};

/**
 * is.gt
 * Test if `value` is greater than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.gt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value > other;
};

/**
 * is.le
 * Test if `value` is less than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */

is.le = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value <= other;
};

/**
 * is.lt
 * Test if `value` is less than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */

is.lt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value < other;
};

/**
 * is.within
 * Test if `value` is within `start` and `finish`.
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
is.within = function (value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
    throw new TypeError('all arguments must be numbers');
  }
  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
  return isAnyInfinite || (value >= start && value <= finish);
};

/**
 * Test object.
 */

/**
 * is.object
 * Test if `value` is an object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */

is.object = function (value) {
  return value && '[object Object]' === toString.call(value);
};

/**
 * is.hash
 * Test if `value` is a hash - a plain object literal.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */

is.hash = function (value) {
  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
};

/**
 * Test regexp.
 */

/**
 * is.regexp
 * Test if `value` is a regular expression.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */

is.regexp = function (value) {
  return '[object RegExp]' === toString.call(value);
};

/**
 * Test string.
 */

/**
 * is.string
 * Test if `value` is a string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */

is.string = function (value) {
  return '[object String]' === toString.call(value);
};


},{}]},{},[1])(1)
});
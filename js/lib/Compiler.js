var concat = require('concat-stream');

var mod = require('module');
var path = require('path');

var through = require('through2');

var Configuration = require('./Configuration');
var ExtenderRegistry = require('./ExtenderRegistry');
var Formatter = require('./Formatter');

var Rule = require('./Rule');
var s = require('./helpers/string');

var PluginError = require('gulp-util').PluginError;
var PLUGIN_NAME = 'blink';

var Compiler = (function () {
    function Compiler(config) {
        this.config = config;
        this.config = config || new Configuration();
    }
    Compiler.prototype.compile = function () {
        var compiler = this;

        // ReSharper disable once JsFunctionCanBeConvertedToLambda
        var stream = through.obj(function (file, enc, done) {
            var onSuccess;
            var onBufferCompiled = function (err, css) {
                if (err) {
                    this.emit('error', new PluginError(PLUGIN_NAME, err.message));
                } else {
                    onSuccess(css);
                    file.path = compiler.renameExtToCss(file);
                }
                this.push(file);
                done();
            }.bind(this);

            if (file.isStream()) {
                file.pipe(concat(function (data) {
                    compiler.compileBuffer(data, file.path, onBufferCompiled);
                }));
                onSuccess = function (css) {
                    file.contents = through();
                    file.contents.write(css);
                };
                return;
            }

            if (file.isBuffer()) {
                onSuccess = function (css) {
                    file.contents = new Buffer(css);
                };
                compiler.compileBuffer(file.contents, file.path, onBufferCompiled);
                return;
            }

            this.emit('error', new PluginError(PLUGIN_NAME, 'Unexpected file mode. Expected stream or buffer.'));

            this.push(file);
            done();
        });

        return stream;
    };

    Compiler.prototype.compileBuffer = function (data, filepath, callback) {
        var exported = this.compileModule(data, path.dirname(filepath));
        if (!(exported instanceof Array)) {
            exported = [exported];
        }
        callback(null, this.compileRules(exported));
    };

    Compiler.prototype.renameExtToCss = function (file) {
        return path.join(file.base, path.basename(file.path, path.extname(file.path)) + '.css');
    };

    Compiler.prototype.compileModule = function (contents, dirname) {
        var m = new mod();
        m.paths = mod._nodeModulePaths(dirname);
        m._compile(contents.toString());
        return m.exports;
    };

    Compiler.prototype.compileRules = function (rules) {
        return new Formatter().format(this.config, this.resolveRules(rules));
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

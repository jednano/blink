var fs = require('fs');
var mod = require('module');
var path = require('path');
var _stream = require('stream');
var stripBOM = require('strip-bom');

var Configuration = require('./Configuration');
var ExtenderRegistry = require('./ExtenderRegistry');
var Formatter = require('./Formatter');

var Rule = require('./Rule');
var s = require('./helpers/string');

var Compiler = (function () {
    function Compiler(config) {
        this.config = config;
        this.config = config || new Configuration();
    }
    Compiler.prototype.compile = function (sources, callback) {
        var _this = this;
        (sources || []).forEach(function (source) {
            if (typeof source === 'string') {
                _this.compileFile({ src: source, dest: path.dirname(source) }, callback);
                return;
            }
            if (source.src && source.src instanceof Array) {
                source.src.forEach(function (src) {
                    _this.compileFile({ src: src, dest: source.dest }, callback);
                });
                return;
            }
            if (source instanceof _stream.Readable) {
                _this.compileStream(source, callback);
                return;
            }
            if (source instanceof Rule) {
                _this.tryCompileRule(source, function (err, contents) {
                    callback(err, { contents: contents });
                });
                return;
            }
            if (source.contents) {
                _this.tryCompileContents(source, callback);
            }
            callback(new Error('Unsupported source input'), {
                src: source
            });
        });
    };

    Compiler.prototype.tryCompileRule = function (rule, callback) {
        try  {
            callback(null, this.compileRules([rule]));
        } catch (err) {
            callback(err);
        }
    };

    Compiler.prototype.compileFile = function (file, callback) {
        var _this = this;
        var stream = fs.createReadStream(path.resolve(file.src));
        this.compileStream(stream, function (err, compiled) {
            if (!err) {
                callback(err, compiled);
                return;
            }
            file.dest = _this.renameExtToCss(file);
            callback(err, file);
        });
    };

    Compiler.prototype.compileStream = function (stream, callback) {
        var _this = this;
        this.readStream(stream, function (err, contents) {
            if (err) {
                callback(err);
                return;
            }
            _this.tryCompileContents({
                src: stream.path,
                contents: contents
            }, callback);
        });
    };

    Compiler.prototype.readStream = function (stream, callback) {
        var contents = '';
        stream.setEncoding('utf8');
        stream.on('readable', function () {
            contents += stream.read() || '';
        });
        stream.on('error', function (err) {
            callback(err);
        });
        stream.on('end', function () {
            callback(null, contents);
        });
    };

    Compiler.prototype.tryCompileContents = function (file, callback) {
        try  {
            var compiled = this.compileModule(stripBOM(file.contents), path.dirname(file.src));
            callback(null, {
                src: file.src,
                dest: this.renameExtToCss(file),
                contents: this.compileRules(compiled instanceof Array ? compiled : [compiled])
            });
        } catch (err) {
            callback(err);
        }
    };

    Compiler.prototype.renameExtToCss = function (file) {
        if (!file.dest && file.src) {
            var ext = new RegExp('\\.' + path.extname(file.src).substr(1) + '$');
            return path.join(path.dirname(file.src), path.basename(file.src).replace(ext, '.css'));
        }
        return file.dest;
    };

    Compiler.prototype.compileModule = function (contents, folder) {
        var m = new mod();
        m.paths = mod._nodeModulePaths(folder);
        m._compile(contents);
        return m.exports;
    };

    Compiler.prototype.compileRules = function (rules) {
        return new Formatter().format(this.config, this.resolveRules(rules));
    };

    Compiler.prototype.resolveRules = function (rules) {
        var _this = this;
        var resolved = [];

        this.resolveExtenders(rules).forEach(function (extended) {
            resolved.push(extended[0]);
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
            var r = new Rule(selectors, { include: [extender] });
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
                if (!extender.length) {
                    extender = extender();
                }
                extenders.add(extender[1], extender[0], rule.selectors);
            });
            var overrides = _this.config.overrides;
            var body = rule.body;
            Object.keys(body).forEach(function (property) {
                var override = overrides[s.camelize(property)];
                if (override) {
                    override = override(body[property]);
                    extenders.add(override[1], override[0], rule.selectors);
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

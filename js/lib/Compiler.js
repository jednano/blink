var fs = require('fs');
var mod = require('module');
var path = require('path');
var _stream = require('stream');
var stripBOM = require('strip-bom');

var Configuration = require('./Configuration');
var ExtenderRegistry = require('./ExtenderRegistry');

var Rule = require('./Rule');

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
            callback(null, {
                src: file.src,
                dest: this.renameExtToCss(file),
                contents: this.compileRules([
                    this.compileModule(stripBOM(file.contents), path.dirname(file.src))
                ])
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
        var _this = this;
        var chunks = [];
        push(this.compileExtenders(rules));

        rules.forEach(function (rule) {
            push(rule.compile(_this.config));
        });
        function push(css) {
            if (css) {
                chunks.push(css);
            }
        }

        return chunks.join(this.config.ruleSeparator);
    };

    Compiler.prototype.compileExtenders = function (rules) {
        var _this = this;
        var extenders = new ExtenderRegistry();
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
                var override = overrides[property];
                if (override) {
                    override = override(body[property]);
                    extenders.add(override[1], override[0], rule.selectors);
                    delete body[property];
                }
            });
        });
        return extenders.map(function (extender, selectors) {
            var r = new Rule(selectors, { include: [extender] });
            return r.compile(_this.config);
        }).join(this.config.newline);
    };
    return Compiler;
})();

module.exports = Compiler;

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../bower_components/dt-vinyl/vinyl.d.ts" />
var concat = require('concat-stream');
var mod = require('module');
var path = require('path');
var through = require('through2');

var a = require('./helpers/array');
var CompilerForBrowser = require('./browser/Compiler');
var Configuration = require('./Configuration');

var PluginError = require('gulp-util').PluginError;
var PLUGIN_NAME = 'blink';

var Compiler = (function (_super) {
    __extends(Compiler, _super);
    function Compiler(config) {
        _super.call(this, config || new Configuration());
        this.config = config;
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

    Compiler.prototype.renameExtToCss = function (file) {
        var dir = path.dirname(file.path);
        var basename = path.basename(file.path, path.extname(file.path));
        return path.join(dir, basename + '.css');
    };

    Compiler.prototype.compileBuffer = function (data, filepath, callback) {
        try  {
            var rules = a.flatten([mod._load(filepath)]);
            _super.prototype.compileRules.call(this, rules, callback);
        } catch (err) {
            callback(err);
        }
    };
    return Compiler;
})(CompilerForBrowser);

module.exports = Compiler;

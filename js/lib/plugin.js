var gutil = require('gulp-util');
var mod = require('module');
var path = require('path');
var through = require('through2');
var Compiler = require('./Compiler');
var Configuration = require('./Configuration');
var PLUGIN_NAME = 'blink';
var PluginError = gutil.PluginError;
// ReSharper disable once UnusedLocals
function plugin(options) {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }
        if (file.isStream()) {
            cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }
        try {
            var rule = compileModule(file);
        }
        catch (err) {
            cb(new PluginError(PLUGIN_NAME, err.message, {
                showStack: true
            }));
            return;
        }
        var config = new Configuration(options);
        new Compiler(config).compile(rule, function (err2, css) {
            if (err2) {
                cb(new PluginError(PLUGIN_NAME, err2.message, {
                    showStack: true
                }));
                return;
            }
            file.contents = new Buffer(css);
            file.path = renameExtToCss(file);
            cb(null, file);
        });
    });
}
function compileModule(file) {
    var m = new mod();
    m.paths = mod._nodeModulePaths(path.dirname(file.path));
    m._compile(file.contents.toString());
    return m.exports;
}
function renameExtToCss(file) {
    var dir = path.dirname(file.path);
    var basename = path.basename(file.path, path.extname(file.path));
    return path.join(dir, basename + '.css');
}
module.exports = plugin;

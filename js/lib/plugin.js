var gutil = require('gulp-util');
var through = require('through2');
var Configuration = require('./Configuration');
var VinylCompiler = require('./VinylCompiler');
var PLUGIN_NAME = 'blink';
var PluginError = gutil.PluginError;
function plugin(options) {
    var compiler = new VinylCompiler(new Configuration(options));
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
            cb(null, compiler.compile(file));
        }
        catch (err) {
            cb(new PluginError(PLUGIN_NAME, err.message, {
                showStack: true
            }));
        }
    });
}
module.exports = plugin;

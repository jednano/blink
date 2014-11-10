var mod = require('module');
var path = require('path');
var Compiler = require('./Compiler');
var VinylCompiler = (function () {
    function VinylCompiler(config) {
        this.compiler = new Compiler(config);
    }
    VinylCompiler.prototype.compile = function (file) {
        var css = this.compiler.compile(compileModule(file));
        var result = file.clone({ contents: false });
        result.contents = new Buffer(css);
        result.path = renameExtToCss(result);
        return result;
    };
    return VinylCompiler;
})();
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
module.exports = VinylCompiler;

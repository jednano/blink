var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../bower_components/dt-node/node.d.ts"/>
var extend = require('node.extend');
var stripBom = require('strip-bom');
var fs = require('fs');
var os = require('os');
var path = require('path');

var ConfigurationForBrowser = require('./browser/Configuration');

var s = require('./helpers/string');

var newlines = {
    os: os.EOL,
    lf: '\n',
    crlf: '\r\n'
};

var Configuration = (function (_super) {
    __extends(Configuration, _super);
    function Configuration(options) {
        _super.call(this, options);
        this.set(require('../../defaults.json'));
        var extended = this.loadPlugins(options);
        var clonedOptions = extend({}, options || {});
        delete clonedOptions.plugins;
        extended.set(clonedOptions);
        return extended;
    }
    Configuration.prototype.loadPlugins = function (options) {
        if (!options) {
            return this;
        }
        var result = this;
        (options.plugins || []).forEach(function (pluginPath) {
            result = this.tryLoadingPlugin(pluginPath)(this);
        }.bind(this));
        return result;
    };

    Configuration.prototype.tryLoadingPlugin = function (pluginPath) {
        try  {
            return require(pluginPath);
        } catch (err) {
            throw new Error('Invalid plugin. Path not found: ' + pluginPath);
        }
    };

    Configuration.prototype.registerFunctions = function (configProperty, folder) {
        var overrides = {};
        fs.readdir(folder, function (err, files) {
            if (err) {
                throw err;
            }
            files.forEach(function (file) {
                var property = s.dasherize(path.basename(file, '.js'));
                overrides[property] = require(file);
            });
        });
        return overrides;
    };

    Configuration.prototype.loadConfig = function (filename) {
        if (!fs.existsSync(filename)) {
            throw new Error('Configuration file does not exist: ' + filename);
        }
        var contents = stripBom(fs.readFileSync(filename)).toString();
        try  {
            return JSON.parse(contents);
        } catch (e) {
            throw new Error('Invalid JSON format: ' + filename);
        }
    };

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

    return Configuration;
})(ConfigurationForBrowser);

module.exports = Configuration;

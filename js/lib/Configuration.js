/* istanbul ignore next: TypeScript extend */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../bower_components/dt-node/node.d.ts"/>
var extend = require('node.extend');

var os = require('os');

var ConfigurationForBrowser = require('./browser/Configuration');

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
        this.loadPlugins(options);
    }
    Configuration.prototype.loadPlugins = function (options) {
        if (!options) {
            return this;
        }
        var result = extend(true, this, options);
        (options.plugins || []).forEach(function (pluginPath) {
            extend(true, result, this.tryLoadingPlugin(pluginPath)(result));
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

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
        this.set(options);
    }
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


    Object.defineProperty(Configuration.prototype, "safari", {
        get: function () {
            return this.raw.safari;
        },
        set: function (value) {
            if (typeof value !== 'number') {
                throw new Error('Invalid Safari version. Expected number.');
            }
            this.raw.safari = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "android", {
        get: function () {
            return this.raw.android;
        },
        set: function (value) {
            if (typeof value !== 'number') {
                throw new Error('Invalid Android version. Expected number.');
            }
            this.raw.android = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "firefoxMobile", {
        get: function () {
            return this.raw.firefoxMobile;
        },
        set: function (value) {
            if (typeof value !== 'number') {
                throw new Error('Invalid Firefox Mobile version. Expected number.');
            }
            this.raw.firefoxMobile = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "iePhone", {
        get: function () {
            return this.raw.iePhone;
        },
        set: function (value) {
            if (typeof value !== 'number') {
                throw new Error('Invalid IE Phone version. Expected number.');
            }
            this.raw.iePhone = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "operaMobile", {
        get: function () {
            return this.raw.operaMobile;
        },
        set: function (value) {
            if (typeof value !== 'number') {
                throw new Error('Invalid Opera Mobile version. Expected number.');
            }
            this.raw.operaMobile = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Configuration.prototype, "safariMobile", {
        get: function () {
            return this.raw.safariMobile;
        },
        set: function (value) {
            if (typeof value !== 'number') {
                throw new Error('Invalid Safari Mobile version. Expected number.');
            }
            this.raw.safariMobile = value;
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

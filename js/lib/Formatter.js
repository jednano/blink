var s = require('./helpers/string');

var Formatter = (function () {
    function Formatter() {
    }
    Formatter.prototype.format = function (config, rules) {
        this.config = config;
        return this.formatRules(rules, 0);
    };

    Formatter.prototype.formatRules = function (rules, level) {
        var _this = this;
        if (typeof rules === 'undefined') {
            console.log('undefined');
        }
        return rules.map(function (rule) {
            return _this.formatRule(rule, level);
        }).join('');
    };

    Formatter.prototype.formatRule = function (rule, level) {
        var config = this.config;
        var selectors = rule[0].join(',' + config.oneSpace);
        var body = this.formatBody(rule[1], level + 1);
        var indent = s.repeat(config.oneIndent, level);
        var css = indent + selectors + config.oneSpace + '{' + config.newline;
        css += body;
        css += indent + '}' + config.newline;
        return css;
    };

    Formatter.prototype.formatBody = function (body, level) {
        var firstPair = body[0];
        if (!firstPair || !firstPair.length) {
            return '';
        }

        var firstKey = firstPair[0];
        if (!firstKey) {
            return '';
        }

        var firstVal = firstPair[1];
        if (!firstVal || !firstVal.length) {
            return '';
        }

        if (firstKey[0] === '@' || !this.isDeclarationValue(firstVal)) {
            return this.formatRules(body, level);
        }

        return this.formatDeclarations(body, level);
    };

    Formatter.prototype.isDeclarationValue = function (value) {
        return typeof value === 'string';
    };

    Formatter.prototype.formatDeclarations = function (decs, level) {
        var _this = this;
        var indent = s.repeat(this.config.oneIndent, level);
        return decs.map(function (dec) {
            var prop = dec[0];
            var val = dec[1];
            var css = indent;
            css += prop + ':' + _this.config.oneSpace;
            css += _this.formatValue(val) + ';';
            return css;
        }).join(this.config.declarationSeparator) + this.config.newline;
    };

    Formatter.prototype.formatValue = function (value) {
        if (typeof value === 'string') {
            return value;
        }
        return value.join(' ');
    };
    return Formatter;
})();

module.exports = Formatter;

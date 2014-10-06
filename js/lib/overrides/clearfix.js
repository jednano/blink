var noop = require('../extenders/noop');

var s = require('../helpers/string');

// ReSharper disable once UnusedLocals
function clearfix(value) {
    if (!value) {
        return noop();
    }

    var override = (function (config) {
        return [
            ['content', s.repeat(config.quote, 2)],
            ['display', 'table'],
            ['clear', 'both']
        ];
    });

    override.args = arguments;
    override.selectors = [':after'];

    return override;
}

module.exports = clearfix;

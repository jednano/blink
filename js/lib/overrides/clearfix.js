var noop = require('../extenders/noop');

// ReSharper disable once UnusedLocals
function clearfix(value) {
    if (!value) {
        return noop();
    }

    var override = (function () {
        return [
            ['content', ''],
            ['display', 'table'],
            ['clear', 'both']
        ];
    });

    override.args = arguments;
    override.selectors = [':after'];

    return override;
}

module.exports = clearfix;

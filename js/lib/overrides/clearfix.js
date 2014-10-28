var s = require('../helpers/string');

// ReSharper disable once UnusedLocals
function clearfix(value) {
    var override = (function (config) {
        if (!value) {
            // ReSharper disable once InconsistentFunctionReturns
            return;
        }
        return [
            ['content', s.repeat(config.quote, 2)],
            ['display', 'table'],
            ['clear', 'both']
        ];
    });

    override.selectors = [':after'];

    return override;
}

module.exports = clearfix;

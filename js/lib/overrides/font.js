var _font = require('../extenders/font');

// ReSharper disable once UnusedLocals
function font(value) {
    var override = (function () {
        if (typeof value === 'string') {
            return [['font', value]];
        }
        return _font(value)();
    });

    override.args = arguments;
    return override;
}

module.exports = font;

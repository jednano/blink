var _background = require('../extenders/background');

// ReSharper disable once UnusedLocals
function background(value) {
    var override = (function () {
        return _background(value)();
    });

    override.args = arguments;
    return override;
}

module.exports = background;

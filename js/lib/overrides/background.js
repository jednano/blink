var _background = require('../extenders/background');

// ReSharper disable once UnusedLocals
function background(value) {
    return [
        arguments, function () {
            return _background(value)[1]();
        }];
}

module.exports = background;

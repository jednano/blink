var _font = require('../extenders/font');

// ReSharper disable once UnusedLocals
function font(value) {
    return [
        arguments, function () {
            if (typeof value === 'string') {
                return [['font', value]];
            }
            return _font(value)[1]();
        }];
}

module.exports = font;

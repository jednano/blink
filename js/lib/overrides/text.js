var textSizeAdjust = require('./textSizeAdjust');

// ReSharper disable once UnusedLocals
function text(value) {
    if (value.hasOwnProperty('size')) {
        var size = value.size;
        if (size.hasOwnProperty('adjust')) {
            return textSizeAdjust(size.adjust);
        }
    }

    var override = (function () {
        return [['text', value]];
    });

    override.args = arguments;
    return override;
}

module.exports = text;

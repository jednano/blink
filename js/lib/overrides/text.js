var textSizeAdjust = require('./textSizeAdjust');
// ReSharper disable once UnusedLocals
function text(value) {
    if (value.hasOwnProperty('size')) {
        var size = value.size;
        if (size.hasOwnProperty('adjust')) {
            return textSizeAdjust(size.adjust);
        }
    }
    // ReSharper disable once NotAllPathsReturnValue
}
module.exports = text;

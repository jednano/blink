var boxSizing = require('./boxSizing');

// ReSharper disable once UnusedLocals
function box(value) {
    if (value.hasOwnProperty('sizing')) {
        return boxSizing(value.sizing);
    }

    var override = (function () {
        return [['box', value]];
    });

    override.args = arguments;
    return override;
}

module.exports = box;

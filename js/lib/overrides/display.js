var inlineBlock = require('../extenders/inlineBlock');

// ReSharper disable once UnusedLocals
function display(value) {
    var override = (function (config) {
        switch (value) {
            case 'inline-block':
                return inlineBlock()(config);
            default:
                return [['display', value]];
        }
    });

    override.args = arguments;
    return override;
}

module.exports = display;

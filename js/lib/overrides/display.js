var inlineBlock = require('../extenders/inlineBlock');
// ReSharper disable once UnusedLocals
function display(value, options) {
    return function (config) {
        switch (value) {
            case 'inline-block':
                return inlineBlock(options)(config);
            default:
                if (options) {
                    throw new Error('Unused options for display override');
                }
                return value;
        }
    };
}
module.exports = display;

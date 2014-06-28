var inlineBlock = require('../extenders/inlineBlock');

// ReSharper disable once UnusedLocals
function display(value) {
    return [
        arguments, function (config) {
            switch (value) {
                case 'inline-block':
                    return inlineBlock()[1](config);
                default:
                    return [['display', value]];
            }
        }];
}

module.exports = display;

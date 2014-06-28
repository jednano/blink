var experimental = require('../extenders/experimental');

// http://css-tricks.com/box-sizing/
// ReSharper disable once UnusedLocals
function boxSizing(value) {
    return [
        arguments, function (config) {
            return experimental('box-sizing', value, {
                official: true,
                webkit: true,
                moz: true
            })[1](config);
        }];
}

module.exports = boxSizing;

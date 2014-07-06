var experimental = require('../extenders/experimental');

// http://css-tricks.com/box-sizing/
// ReSharper disable once UnusedLocals
function boxSizing(value) {
    var override = (function (config) {
        return experimental('box-sizing', value, {
            official: true,
            webkit: true,
            moz: true
        })(config);
    });

    override.args = arguments;
    return override;
}

module.exports = boxSizing;

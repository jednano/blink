var experimental = require('../extenders/experimental');

// ReSharper disable once UnusedLocals
function textSizeAdjust(value) {
    return (function (config) {
        return experimental('text-size-adjust', value, {
            webkit: true,
            moz: true,
            ms: true
        })(config);
    });
}

module.exports = textSizeAdjust;

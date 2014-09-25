var experimental = require('../extenders/experimental');

// ReSharper disable once UnusedLocals
function textSizeAdjust(value) {
    var override = (function (config) {
        return experimental('text-size-adjust', value, {
            webkit: true,
            moz: true,
            ms: true
        })(config);
    });

    override.args = arguments;
    return override;
}

module.exports = textSizeAdjust;

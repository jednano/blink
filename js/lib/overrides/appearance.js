var experimental = require('../extenders/experimental');

function appearance(value) {
    var override = (function (config) {
        return experimental('appearance', value, {
            webkit: true,
            moz: true
        })(config);
    });

    override.args = arguments;
    return override;
}

module.exports = appearance;

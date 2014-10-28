var experimental = require('../extenders/experimental');

function appearance(value) {
    return (function (config) {
        return experimental('appearance', value, {
            webkit: true,
            moz: true
        })(config);
    });
}

module.exports = appearance;

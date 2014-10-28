var experimental = require('../extenders/experimental');
// ReSharper disable once UnusedLocals
function appearance(value) {
    return function (config) {
        return experimental('appearance', value, {
            webkit: true,
            moz: true
        })(config);
    };
}
module.exports = appearance;

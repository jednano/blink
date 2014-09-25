var experimental = require('./experimental');

function appearance(value) {
    var extender = (function (config) {
        return experimental('appearance', value, {
            webkit: true
        })(config);
    });

    extender.args = arguments;
    return extender;
}

module.exports = appearance;

var experimental = require('./experimental');

function boxSizing(value) {
    var extender = (function (config) {
        return experimental('box-sizing', value, {
            official: true,
            webkit: true,
            moz: true
        })(config);
    });

    extender.args = arguments;
    return extender;
}

module.exports = boxSizing;

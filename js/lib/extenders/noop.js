// ReSharper disable once UnusedLocals
function noop() {
    var extender = (function () {
        return [];
    });
    extender.args = arguments;
    return extender;
}

module.exports = noop;

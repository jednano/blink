// ReSharper disable once UnusedLocals
function clearfix() {
    var extender = (function () {
        return [
            ['content', ''],
            ['display', 'table'],
            ['clear', 'both']
        ];
    });

    extender.args = arguments;
    extender.selectors = [':after'];

    return extender;
}

module.exports = clearfix;

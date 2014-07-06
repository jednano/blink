// ReSharper disable once UnusedLocals
function background(options) {
    options = options || {};

    var extender = (function () {
        var values = [];

        ['color', 'image', 'repeat', 'attachment', 'position'].forEach(function (prop) {
            if (options.hasOwnProperty(prop)) {
                values.push(options[prop]);
            }
        });

        if (values.length) {
            return [['background', values]];
        }

        return [];
    });

    extender.args = arguments;
    return extender;
}

module.exports = background;

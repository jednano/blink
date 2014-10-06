// ReSharper disable once UnusedLocals
function background(options) {
    options = options || {};

    var override = (function () {
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

    override.args = arguments;
    return override;
}

module.exports = background;

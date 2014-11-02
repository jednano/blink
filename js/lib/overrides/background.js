// ReSharper disable once UnusedLocals
function background(options) {
    options = options || {};
    // ReSharper disable once UnusedParameter
    return function (config) {
        var values = [];
        [
            'attachment',
            'clip',
            'color',
            'image',
            'origin',
            'position',
            'repeat',
            'size'
        ].forEach(function (prop) {
            if (options.hasOwnProperty(prop)) {
                values.push(options[prop]);
            }
        });
        if (values.length) {
            return [['background', values.join(' ')]];
        }
        return [];
    };
}
module.exports = background;

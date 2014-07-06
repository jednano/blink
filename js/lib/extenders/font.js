// ReSharper disable once UnusedLocals
function font(options) {
    options = options || {};

    var extender = (function () {
        var values = [];

        ['style', 'variant', 'weight'].forEach(function (prop) {
            if (options.hasOwnProperty(prop)) {
                values.push(options[prop]);
            }
        });

        if (options.hasOwnProperty('size')) {
            if (options.hasOwnProperty('lineHeight')) {
                values.push(options.size + '/' + options.lineHeight);
            } else {
                values.push(options.size);
            }
            return [['font', values]];
        }

        var decs = [];

        if (options.hasOwnProperty('lineHeight')) {
            decs.push(['line-height', options.lineHeight]);
        }

        if (values.length) {
            decs.unshift(['font', values]);
        }

        return decs;
    });

    extender.args = arguments;
    return extender;
}

module.exports = font;

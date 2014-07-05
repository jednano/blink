// ReSharper disable once UnusedLocals
function background(options) {
    options = options || {};

    return [
        arguments, function () {
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
        }];
}

module.exports = background;

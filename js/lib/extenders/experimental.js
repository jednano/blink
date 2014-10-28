// ReSharper disable once UnusedLocals
function experimental(property, value, options) {
    options = options || {};
    return (function (config) {
        var decs = [];
        ['webkit', 'khtml', 'moz', 'ms', 'o'].forEach(function (vendor) {
            if (options[vendor] && config[vendor + 'Prefix']) {
                decs.push(['-' + vendor + '-' + property, value]);
            }
        });
        if (options.official) {
            decs.push([property, value]);
        }
        return decs;
    });
}
module.exports = experimental;

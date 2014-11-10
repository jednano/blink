var s = require('../helpers/string');
// ReSharper disable once UnusedLocals
function clearfix(value) {
    return function (config) {
        if (!value) {
            return {};
        }
        return {
            ':after': [
                ['content', s.repeat(config.quote, 2)],
                ['display', 'table'],
                ['clear', 'both']
            ]
        };
    };
}
module.exports = clearfix;

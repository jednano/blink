// ReSharper disable once UnusedLocals
function fill(value) {
    // ReSharper disable once UnusedParameter
    return function (config) {
        if (!value) {
            return [];
        }
        return [
            ['position', 'absolute'],
            ['top', '0'],
            ['right', '0'],
            ['bottom', '0'],
            ['left', '0']
        ];
    };
}
module.exports = fill;

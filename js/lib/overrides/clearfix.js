var _clearfix = require('../extenders/clearfix');
var noop = require('../extenders/noop');

// ReSharper disable once UnusedLocals
function clearfix(value) {
    return value ? _clearfix() : noop();
}

module.exports = clearfix;

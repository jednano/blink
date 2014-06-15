// ReSharper disable InconsistentNaming
var STRING_DASHERIZE = /[ _]/g;
var STRING_DASHERIZE_CACHE = {};
var STRING_DECAMELIZE = /([a-z\d])([A-Z])/g;

// ReSharper restore InconsistentNaming
function repeat(s, n) {
    return new Array(n + 1).join(s);
}
exports.repeat = repeat;
;

/**
Replaces underscores, spaces, or camelCase with dashes.
*/
function dasherize(s) {
    var cache = STRING_DASHERIZE_CACHE;
    var hit = cache.hasOwnProperty(s);

    if (hit) {
        return cache[s];
    }

    return cache[s] = exports.decamelize(s).replace(STRING_DASHERIZE, '-');
}
exports.dasherize = dasherize;

/**
Converts a camelized string into all lower case separated by underscores.
*/
function decamelize(s) {
    return s.replace(STRING_DECAMELIZE, '$1_$2').toLowerCase();
}
exports.decamelize = decamelize;

// ReSharper disable InconsistentNaming
var STRING_DASHERIZE = /[ _]/g;
var STRING_DASHERIZE_CACHE = {};
var STRING_DECAMELIZE = /([a-z\d])([A-Z])/g;
// ReSharper restore InconsistentNaming


export function repeat(s: string, n: number) {
	return new Array(n + 1).join(s);
};

/**
	Replaces underscores, spaces, or camelCase with dashes.
*/
export function dasherize(s: string) {
	var cache = STRING_DASHERIZE_CACHE;
	var hit = cache.hasOwnProperty(s);

	if (hit) {
		return cache[s];
	}

	return cache[s] = decamelize(s).replace(STRING_DASHERIZE, '-');
}

/**
	Converts a camelized string into all lower case separated by underscores.
*/
export function decamelize(s: string) {
	return s.replace(STRING_DECAMELIZE, '$1_$2').toLowerCase();
}

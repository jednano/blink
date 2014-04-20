// ReSharper disable InconsistentNaming
var STRING_DASHERIZE_REGEXP = (/[ _]/g);
var STRING_DASHERIZE_CACHE = {};
var STRING_DECAMELIZE_REGEXP = (/([a-z\d])([A-Z])/g);
// ReSharper restore InconsistentNaming

export function dasherize(str) {
	var cache = STRING_DASHERIZE_CACHE;
	var hit = cache.hasOwnProperty(str);

	if (hit) {
		return cache[str];
	}

	return cache[str] = decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}

export function decamelize(str) {
	return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}

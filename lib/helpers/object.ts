export function isPlainObject(o: Object) {
	if (typeof o === 'object' && o) {
		return o.constructor === Object;
	}
	return false;
}

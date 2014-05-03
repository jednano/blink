export function flatten(arr: any[]) {
	var flat = [];
	arr.forEach(item => {
		if (item.forEach) {
			[].push.apply(flat, flatten(item));
			return;
		}
		flat.push(item);
	});
	return flat;
}

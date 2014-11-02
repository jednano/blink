import Configuration = require('../Configuration');

// ReSharper disable once UnusedLocals
function fill(value: boolean) {

	// ReSharper disable once UnusedParameter
	return (config: Configuration) => {
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

export = fill;

import _background = require('../extenders/background');


// ReSharper disable once UnusedLocals
function background(value: any): any[] {
	return [arguments, () => {
		return _background(value)[1]();
	}];
}

export = background;

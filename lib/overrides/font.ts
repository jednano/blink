import _font = require('../extenders/font');


// ReSharper disable once UnusedLocals
function font(value: any): any[] {
	return [arguments, () => {
		if (typeof value === 'string') {
			return [['font', value]];
		}
		return _font(value)[1]();
	}];
}

export = font;

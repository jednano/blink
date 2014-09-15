import _font = require('../extenders/font');
import Override = require('../interfaces/Override');


// ReSharper disable once UnusedLocals
function font(value: any) {

	var override = <Override>(() => {
		if (typeof value === 'string') {
			return [['font', value]];
		}
		return _font(value)();
	});

	override.args = arguments;
	return override;

}

export = font;

import _font = require('../extenders/font');
import IOverride = require('../interfaces/IOverride');


// ReSharper disable once UnusedLocals
function font(value: any) {

	var override = <IOverride>(() => {
		if (typeof value === 'string') {
			return [['font', value]];
		}
		return _font(value)();
	});

	override.args = arguments;
	return override;

}

export = font;

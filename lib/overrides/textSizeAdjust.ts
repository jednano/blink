import Configuration = require('../Configuration');
import Override = require('../interfaces/Override');
import experimental = require('../extenders/experimental');


// ReSharper disable once UnusedLocals
function textSizeAdjust(value: any) {

	var override = <Override>((config: Configuration) => {
		return experimental('text-size-adjust', value, {
			webkit: true,
			   moz: true,
			    ms: true
		})(config);
	});

	override.args = arguments;
	return override;

}

export = textSizeAdjust;

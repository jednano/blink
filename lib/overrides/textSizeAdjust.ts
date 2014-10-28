import Configuration = require('../Configuration');
import experimental = require('../extenders/experimental');


// ReSharper disable once UnusedLocals
function textSizeAdjust(value: any) {

	return ((config: Configuration) => {
		return experimental('text-size-adjust', value, {
			webkit: true,
			   moz: true,
			    ms: true
		})(config);
	});

}

export = textSizeAdjust;

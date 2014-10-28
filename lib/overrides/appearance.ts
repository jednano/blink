import Configuration = require('../Configuration');
import experimental = require('../extenders/experimental');

// ReSharper disable once UnusedLocals
function appearance(value: string) {

	return (config: Configuration) => {
		return experimental('appearance', value, {
			webkit: true,
			   moz: true
		})(config);
	};

}

export = appearance;

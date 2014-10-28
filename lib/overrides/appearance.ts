import Configuration = require('../Configuration');
import experimental = require('../extenders/experimental');

function appearance(value: string) {

	return ((config: Configuration) => {
		return experimental('appearance', value, {
			webkit: true,
			   moz: true
		})(config);
	});

}

module.exports = appearance;

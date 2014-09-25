import Configuration = require('../Configuration');
import experimental = require('./experimental');
import Extender = require('../interfaces/Extender');

function appearance(value: string) {

	var extender = <Extender>((config: Configuration) => {
		return experimental('appearance', value, {
			webkit: true
		})(config);
	});

	extender.args = arguments;
	return extender;

}

module.exports = appearance;

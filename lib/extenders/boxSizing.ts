import Configuration = require('../Configuration');
import experimental = require('./experimental');
import Extender = require('../interfaces/Extender');

function boxSizing(value: string) {

	var extender = <Extender>((config: Configuration) => {
		return experimental('box-sizing', value, {
			official: true,
			  webkit: true,
			     moz: true
		})(config);
	});

	extender.args = arguments;
	return extender;

}

module.exports = boxSizing;

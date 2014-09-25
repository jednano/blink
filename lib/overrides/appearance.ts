import Configuration = require('../Configuration');
import experimental = require('../extenders/experimental');
import Override = require('../interfaces/Override');

function appearance(value: string) {

	var override = <Override>((config: Configuration) => {
		return experimental('appearance', value, {
			webkit: true,
			   moz: true
		})(config);
	});

	override.args = arguments;
	return override;

}

module.exports = appearance;

import Configuration = require('../Configuration');
import experimental = require('../extenders/experimental');
import Override = require('../interfaces/Override');

// ReSharper disable once UnusedLocals
function boxSizing(value: string) {

	var override = <Override>((config: Configuration) => {
		return experimental('box-sizing', value, {
			official: true,
			webkit: !(
				config.chrome >= 10 &&
				config.safari >= 5.1 &&
				config.android >= 4
			),
			moz: !(
				config.firefox >= 29 &&
				config.firefoxMobile >= 29
			)
		})(config);
	});

	override.args = arguments;
	return override;

}

export = boxSizing;

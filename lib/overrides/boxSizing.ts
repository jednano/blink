import Configuration = require('../Configuration');
import experimental = require('../extenders/experimental');

// ReSharper disable once UnusedLocals
function boxSizing(value: string) {

	return ((config: Configuration) => {
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

}

export = boxSizing;

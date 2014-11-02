import Configuration = require('../Configuration');

// ReSharper disable once UnusedLocals
function display(value: string, options?: {
	verticalAlign?: string
}) {

	options = options || {};

	return (config: Configuration): any => {
		switch (value) {
			case 'inline-block':
				return inlineBlock()(config);
			default:
				if (Object.keys(options).length) {
					throw new Error('Unused options for display override');
				}
				return value;
		}
	};

	function inlineBlock() {
		return (config: Configuration) => {
			var decs = [];

			if (config.firefox < 3) {
				decs.push(['display', '-moz-inline-stack']);
			}

			decs.push(['display', 'inline-block']);

			if (options.verticalAlign !== null) {
				decs.push(['vertical-align', options.verticalAlign || 'middle']);
			}

			if (config.ie < 8) {
				decs.push(['*vertical-align', 'auto']);
				decs.push(['zoom', '1']);
				decs.push(['*display', 'inline']);
			}

			return decs;
		};
	}

}

export = display;

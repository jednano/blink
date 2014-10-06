import Configuration = require('../Configuration');
import experimental = require('../extenders/experimental');
import Override = require('../interfaces/Override');

// ReSharper disable once UnusedLocals
function opacity(value: number): Override;
function opacity(value: string): Override;
function opacity(value: any) {

	var override = <Override>((config: Configuration) => {
		var decs = [];

		if (config.ie < 9 || config.ieMobile < 9) {

			var alphaArgs = 'Opacity=' + Math.round(value * 100);
			if (value === 1) {
				alphaArgs = 'enabled=false';
			}

			// IE 8
			[].push.apply(decs, experimental('filter', 'progid:DXImageTransform.' +
				'Microsoft.Alpha(' + alphaArgs + ')',
				{ ms: true }
				)(config));

			// IE 5-7
			if (config.ie < 8 || config.ieMobile < 8) {
				decs.push(['filter', 'alpha(' + alphaArgs.toLowerCase() + ')']);
			}

		}

		[].push.apply(decs, experimental('opacity', value, {
			khtml: config.safari < 1.2,
			moz: config.firefox < 0.9,
			official: true
		})(config));

		// Trigger "hasLayout" in IE 7 and lower
		if (config.ie < 8 || config.ieMobile < 8) {
			decs.push(['zoom', 1]);
		}

		return decs;
	});

	override.args = arguments;
	return override;

}

export = opacity;

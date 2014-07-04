// ReSharper disable once UnusedLocals
function font(options?: {
		style?: string;
		variant?: string;
		weight?: string;
		size?: any;
		lineHeight?: any;
	}): any[] {

	options = options || {};

	return [arguments, () => {

		var values = [];

		['style', 'variant', 'weight'].forEach(prop => {
			if (options.hasOwnProperty(prop)) {
				values.push(options[prop]);
			}
		});

		if (options.hasOwnProperty('size')) {
			if (options.hasOwnProperty('lineHeight')) {
				values.push(options.size + '/' + options.lineHeight);
			} else {
				values.push(options.size);
			}
			return [['font', values]];
		}

		var decs = [];

		if (options.hasOwnProperty('lineHeight')) {
			decs.push(['line-height', options.lineHeight]);
		}

		if (values.length) {
			decs.unshift(['font', values]);
		}

		return decs;
	}];
}

export = font;

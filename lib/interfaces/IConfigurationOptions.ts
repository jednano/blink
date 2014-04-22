import IBrowserSupportOptions = require('./IBrowserSupportOptions');


interface IConfigurationOptions {

	// Output style
	outputStyle?: string;
	oneIndent?: string;
	quoteType?: string;
	newline?: string;

	// BEM
	blockFormat?: string;
	elementFormat?: string;
	modifierFormat?: string;

	// Cross-Browser Support
	browserSupport?: IBrowserSupportOptions;

}

export = IConfigurationOptions;

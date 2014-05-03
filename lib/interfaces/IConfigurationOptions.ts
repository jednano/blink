interface IConfigurationOptions {

	config?: string;

	// Output style
	style?: string;
	oneIndent?: string;
	quote?: string;
	newline?: string;

	// BEM
	block?: string;
	element?: string;
	modifier?: string;

	// Cross-Browser Support
	chrome?: number;
	firefox?: number;
	ie?: number;
	opera?: number;

}

export = IConfigurationOptions;

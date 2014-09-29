module.exports = function(options) {

	options = options || {};
	options.myplugin = options.myplugin || {};

	var settings = {

		// Normal setting
		foo: 'baz',

		// Overridden setting
		bar: options.myplugin.bar || 'qux'

	};

	// Modified setting
	settings.fooCaps = settings.foo.toUpperCase();
	settings.barCaps = settings.bar.toUpperCase();

	// Return your plugin settings with a namespace (e.g., myplugin)
	return { myplugin: settings };

};

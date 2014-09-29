module.exports = function(overrides) {

	overrides = overrides || {};
	overrides = overrides.myplugin = overrides.myplugin || {};

	var myplugin = {

		// Normal setting
		foo: 'baz',

		// Overridden setting
		bar: overrides.bar || 'qux'

	};

	// Modified setting
	myplugin.fooCaps = myplugin.foo.toUpperCase();
	myplugin.barCaps = myplugin.bar.toUpperCase();

	// Return your plugin myplugin with a namespace (e.g., myplugin)
	return { myplugin: myplugin };

};

///<reference path="../bower_components/dt-node/node.d.ts"/>
var extend = require('node.extend');
import os = require('os');

import ConfigurationForBrowser = require('./browser/Configuration');
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');

var newlines = {
	os: os.EOL,
	lf: '\n',
	crlf: '\r\n'
};

class Configuration
	extends ConfigurationForBrowser
	implements ConfigurationOptions {

	constructor(options?: ConfigurationOptions) {
		super(options);
		this.set(require('../../defaults.json'));
		this.loadPlugins(options);
	}

	loadPlugins(options?: ConfigurationOptions) {
		if (!options) {
			return this;
		}
		var result = extend(true, this, options);
		(options.plugins || []).forEach(pluginPath => {
			extend(true, result, this.tryLoadingPlugin(pluginPath)(result));
		});
		return result;
	}

	private tryLoadingPlugin(pluginPath): Function {
		try {
			return require(pluginPath);
		} catch (err) {
			throw new Error('Invalid plugin. Path not found: ' + pluginPath);
		}
	}

	get newline() {
		switch (this.style) {
			case 'compact':
			case 'compressed':
				return '';
			default:
				return newlines[this.raw.newline];
		}
	}

	set newline(value: string) {
		value = value.toLowerCase();
		if (!newlines.hasOwnProperty(value)) {
			throw new Error('Unsupported newline: ' + value);
		}
		this.raw.newline = value;
	}

}

export = Configuration;

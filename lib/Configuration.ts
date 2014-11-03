///<reference path="../bower_components/dt-node/node.d.ts"/>
var extend = require('node.extend');
import fs = require('fs');
import os = require('os');
import path = require('path');

import _overrides = require('./overrides/all');
import ConfigurationForBrowser = require('./browser/Configuration');
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');
import Overrides = require('./interfaces/Overrides');
import s = require('./helpers/string');

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

	public loadPlugins(options?: ConfigurationOptions) {
		if (!options) {
			return this;
		}
		var result = extend(true, this, options);
		(options.plugins || []).forEach(function(pluginPath) {
			extend(true, result, this.tryLoadingPlugin(pluginPath)(result));
		}.bind(this));
		return result;
	}

	private tryLoadingPlugin(pluginPath): Function {
		try {
			return require(pluginPath);
		} catch (err) {
			throw new Error('Invalid plugin. Path not found: ' + pluginPath);
		}
	}

	public get newline() {
		switch (this.style) {
			case 'compact':
			case 'compressed':
				return '';
			default:
				return newlines[this.raw.newline];
		}
	}

	public set newline(value: string) {
		value = value.toLowerCase();
		if (!newlines.hasOwnProperty(value)) {
			throw new Error('Unsupported newline: ' + value);
		}
		this.raw.newline = value;
	}

}

export = Configuration;

///<reference path="../bower_components/dt-node/node.d.ts"/>
var extend = require('node.extend');
var stripBom = require('strip-bom');
import fs = require('fs');
import os = require('os');
import path = require('path');

import _extenders = require('./extenders/all');
import _overrides = require('./overrides/all');
import ConfigurationForBrowser = require('./browser/Configuration');
import ConfigurationOptions = require('./interfaces/ConfigurationOptions');
import Extenders = require('./interfaces/Extenders');
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
		var extended = this.loadPlugins(options);
		var clonedOptions = extend({}, options || {});
		delete clonedOptions.plugins;
		extended.set(clonedOptions);
		return <Configuration>extended;
	}

	public loadPlugins(options?: ConfigurationOptions) {
		if (!options) {
			return this;
		}
		var result = this;
		(options.plugins || []).forEach(function(pluginPath) {
			result = this.tryLoadingPlugin(pluginPath)(this);
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

	public registerFunctions(configProperty: string, folder: string) {
		var overrides: any = {};
		fs.readdir(folder, (err, files) => {
			if (err) {
				throw err;
			}
			files.forEach(file => {
				var property = s.dasherize(path.basename(file, '.js'));
				overrides[property] = require(file);
			});
		});
		return overrides;
	}

	private loadConfig(filename: string) {
		if (!fs.existsSync(filename)) {
			throw new Error('Configuration file does not exist: ' + filename);
		}
		var contents = stripBom(fs.readFileSync(filename)).toString();
		try {
			return JSON.parse(contents);
		} catch (e) {
			throw new Error('Invalid JSON format: ' + filename);
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

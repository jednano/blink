import IExtenders = require('../interfaces/IExtenders');
import background = require('./background');
import experimental = require('./experimental');
import font = require('./font');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: IExtenders = {
	background: background,
	experimental: experimental,
	font: font,
	inlineBlock: inlineBlock
};

export = extenders;

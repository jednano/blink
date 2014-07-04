import IExtenders = require('../interfaces/IExtenders');
import experimental = require('./experimental');
import font = require('./font');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: IExtenders = {
	experimental: experimental,
	font: font,
	inlineBlock: inlineBlock
};

export = extenders;

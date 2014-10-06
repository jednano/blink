import Extenders = require('../interfaces/Extenders');
import experimental = require('./experimental');
import font = require('./font');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: Extenders = {
	experimental: experimental,
	font: font,
	inlineBlock: inlineBlock
};

export = extenders;

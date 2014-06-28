import IExtenders = require('../interfaces/IExtenders');
import experimental = require('./experimental');
import inlineBlock = require('./inlineBlock');


// ReSharper disable once UnusedLocals
var extenders: IExtenders = {
	experimental: experimental,
	inlineBlock: inlineBlock
};

export = extenders;

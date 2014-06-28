import experimental = require('../extenders/experimental');
import inlineBlock = require('../extenders/inlineBlock');


interface IExtenders {
	experimental: typeof experimental;
	inlineBlock: typeof inlineBlock;
}

export = IExtenders;

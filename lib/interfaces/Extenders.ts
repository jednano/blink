import experimental = require('../extenders/experimental');
import inlineBlock = require('../extenders/inlineBlock');

interface Extenders {
	experimental: typeof experimental;
	inlineBlock: typeof inlineBlock;
}

export = Extenders;

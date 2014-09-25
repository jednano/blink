import appearance = require('../extenders/appearance');
import background = require('../extenders/background');
import border = require('../extenders/border');
import boxSizing = require('../extenders/boxSizing');
import clearfix = require('../extenders/clearfix');
import experimental = require('../extenders/experimental');
import font = require('../extenders/font');
import inlineBlock = require('../extenders/inlineBlock');


interface Extenders {
	appearance: typeof appearance;
	background: typeof background;
	border: typeof border;
	boxSizing: typeof boxSizing;
	clearfix: typeof clearfix;
	experimental: typeof experimental;
	font: typeof font;
	inlineBlock: typeof inlineBlock;
}

export = Extenders;

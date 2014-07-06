var background = require('./background');
var clearfix = require('./clearfix');
var experimental = require('./experimental');
var font = require('./font');
var inlineBlock = require('./inlineBlock');

// ReSharper disable once UnusedLocals
var extenders = {
    background: background,
    clearfix: clearfix,
    experimental: experimental,
    font: font,
    inlineBlock: inlineBlock
};

module.exports = extenders;

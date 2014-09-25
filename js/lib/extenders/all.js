var appearance = require('./appearance');
var background = require('./background');
var border = require('./border');
var boxSizing = require('./boxSizing');
var clearfix = require('./clearfix');
var experimental = require('./experimental');
var font = require('./font');
var inlineBlock = require('./inlineBlock');

// ReSharper disable once UnusedLocals
var extenders = {
    appearance: appearance,
    background: background,
    border: border,
    boxSizing: boxSizing,
    clearfix: clearfix,
    experimental: experimental,
    font: font,
    inlineBlock: inlineBlock
};

module.exports = extenders;

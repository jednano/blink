var background = require('./background');
var border = require('./border');
var experimental = require('./experimental');
var font = require('./font');
var inlineBlock = require('./inlineBlock');

// ReSharper disable once UnusedLocals
var extenders = {
    background: background,
    border: border,
    experimental: experimental,
    font: font,
    inlineBlock: inlineBlock
};

module.exports = extenders;

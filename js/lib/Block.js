var Rule = require('./Rule');

var Block = (function () {
    function Block(name, declarations) {
        this.name = name;
        this.declarations = declarations;
        this.elements = declarations.elements || [];
        delete declarations.elements;
        this.modifiers = declarations.modifiers || [];
        delete declarations.modifiers;
    }
    Block.prototype.compile = function (config) {
        var selector = config.block.replace('%s', this.name);
        var rules = [new Rule([selector], this.declarations).compile(config)];
        rules.push.apply(rules, this.elements.map(function (element) {
            return element.compile(selector, config);
        }));
        rules.push.apply(rules, this.modifiers.map(function (modifier) {
            return modifier.compile(selector, config);
        }));
        return rules.join(config.newline);
    };
    return Block;
})();

module.exports = Block;

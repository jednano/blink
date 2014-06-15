var Rule = require('./Rule');

var Element = (function () {
    function Element(name, declarations) {
        this.name = name;
        this.declarations = declarations;
        this.modifiers = declarations.modifiers || [];
        delete declarations.modifiers;
    }
    Element.prototype.compile = function (selector, config) {
        selector += config.element.replace('%s', this.name);
        var rules = [new Rule([selector], this.declarations).compile(config)];
        rules.push.apply(rules, this.modifiers.map(function (modifier) {
            return modifier.compile(selector, config);
        }));
        return rules.join(config.newline);
    };
    return Element;
})();

module.exports = Element;

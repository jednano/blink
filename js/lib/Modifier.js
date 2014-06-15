var Rule = require('./Rule');

var Modifier = (function () {
    function Modifier(name, declarations) {
        this.name = name;
        this.declarations = declarations;
        this.elements = declarations.elements || [];
        delete declarations.elements;
    }
    Modifier.prototype.compile = function (selector, config) {
        selector += config.modifier.replace('%s', this.name);
        var rules = [new Rule([selector], this.declarations).compile(config)];
        rules.push.apply(rules, this.elements.map(function (element) {
            return element.compile(selector, config);
        }));
        return rules.join(config.newline);
    };
    return Modifier;
})();

module.exports = Modifier;

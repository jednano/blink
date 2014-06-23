var Rule = require('./Rule');

var Block = (function () {
    function Block(name, body) {
        this.name = name;
        this.body = body;
    }
    Object.defineProperty(Block.prototype, "elements", {
        get: function () {
            return this.body.elements || [];
        },
        set: function (value) {
            this.body.elements = value;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Block.prototype, "modifiers", {
        get: function () {
            return this.body.modifiers || [];
        },
        set: function (value) {
            this.body.modifiers = value;
        },
        enumerable: true,
        configurable: true
    });


    Block.prototype.resolve = function (config) {
        var elements = this.elements;
        delete this.body.elements;
        var modifiers = this.modifiers;
        delete this.body.modifiers;
        var selector = config.block.replace('%s', this.name);
        var resolved = new Rule(selector, this.body).resolve(config);
        this.elements = elements;
        this.modifiers = modifiers;

        elements.forEach(function (element) {
            [].push.apply(resolved, element.resolve(selector, config));
        });
        modifiers.forEach(function (modifier) {
            [].push.apply(resolved, modifier.resolve(selector, config));
        });

        return resolved;
    };
    return Block;
})();

module.exports = Block;

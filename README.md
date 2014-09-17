<img src="https://github.com/blinkjs/blink/blob/master/artwork/blink_256_nobg.png?raw=true" width="256" height="256" alt="blink" align="right">

Blink converts [Node.js][] modules into CSS.

[![Views](https://sourcegraph.com/api/repos/github.com/blinkjs/blink/counters/views-24h.png)](https://sourcegraph.com/github.com/blinkjs/blink)
[![Build Status](https://secure.travis-ci.org/blinkjs/blink.svg)](http://travis-ci.org/blinkjs/blink)
[![Dependency Status](https://gemnasium.com/blinkjs/blink.svg)](https://gemnasium.com/blinkjs/blink)
[![NPM version](https://badge.fury.io/js/blink.svg)](http://badge.fury.io/js/blink)

[![NPM](https://nodei.co/npm/blink.svg?downloads=true)](https://nodei.co/npm/blink/)


## Introduction

If you landed here, you're probably a front-end web developer of some kind. You know how to write JavaScript. You might even have a favorite CSS preprocessor. Sure, they allow you to write [variables and functions](http://sass-lang.com/guide) in some form or another, but they require you learn their domain-specific language, which often falls short of a full-blown language.  You scour their documentation, struggling to find a solutions to problems you already know how to solve in JavaScript. We keep looking for ways to introduce logic into our CSS, so why not just use JavaScript?

[Compass](http://compass-style.org/) provides some great [cross-browser mixins to takes care of vendor prefixes](http://compass-style.org/reference/compass/css3/), but it falls short in that you have to remember to use them and they add considerable bloat if not implemented properly (i.e., [@extend](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#extend)). Blink aims to solve this problem with [overrides](#overrides) that enforce developers to use them without even knowing it. For example, overriding the `display` property would mean that anyone using `display: inline-block;` would automatically [extend](#extenders) the [inlineBlock extender](https://github.com/blinkjs/blink/blob/master/lib/extenders/inlineBlock.ts). This means you can use the latest and greatest techniques of CSS development without trying to remember when you need vendor prefixes for certain CSS declarations.

With blink, browser support is a configuration setting, so when your browser support requirements change, none of your source code has to change. All you do is update your configuration to support different browser versions by setting the minimum versions you wish to support.

Blink is just getting started, so stay tuned for any updates.


## Requirements

- [Node][]


## Features

- [Runs on Node](#runs-on-node)
- [gulpfriendly](#gulp-friendly)
- [Grunt plugin](https://github.com/blinkjs/grunt-blink)
- [Middleware](https://github.com/blinkjs/blink-middleware)
- [Browserified](#browserified)
- [OOCSS with BEM Syntax](#oocss-with-bem)
- [Rules](#rules)
- [Includes](#includes)
- [Mixins](#mixins)
- [Extenders](#extenders)
- [Overrides](#overrides)
- [Responders](#responders)
- [Plugins](#plugins)
- [TypeScript Source](#typescript-source)
- [CLI](https://github.com/blinkjs/blink-cli)
- [API](https://github.com/blinkjs/blink/blob/master/blink.d.ts)
- [Express middleware](https://github.com/blinkjs/blink-middleware)
- [Spriting](#spriting)


### Runs on Node

Unlike most CSS preprocessors out there, blink does not transpile a [DSL](http://en.wikipedia.org/wiki/Domain-specific_language) into CSS. Blink code gets compiled directly as a [Node][] module, giving you access to all JavaScript syntax for free. This, of course, includes variables and functions, as well as [file I/O](http://nodejs.org/api/fs.html). The possibilities are endless.


### Gulp friendly

The [blink.compile() method](https://github.com/blinkjs/blink/blob/master/lib/Compiler.ts#L22-L69)
is written exactly like a gulp plugin. As such, blink will never write intermediate files unless
you want it to do so. Files can be piped to other streams or [gulp plugins](http://gulpjs.com/plugins/)
before being written to their final destination. This gives blink some performance benefits as well as
putting it in the [gulpfriendly](https://www.npmjs.org/search?q=gulpfriendly) category. Blink supports [vinyl](https://github.com/wearefractal/vinyl) files in both stream and buffer modes.

```js
var blink = require('blink');
var gulp = require('gulp');

gulp.task('styles', function() {
  return gulp.src('styles/*.js', { buffer: false })
    .pipe(blink.compile(/* options */))
    .on('error', function(err) {
      // handle error
    })
    .pipe(gulp.dest('dist/styles'));
});
```

_Note: [gulp-blink](https://github.com/blinkjs/gulp-blink) has been deprecated in favor of
using the blink module directly._


### Browserified

For those wishing to transpile blink files into CSS in the browser, a [Browserified](http://browserify.org/) version of blink is available in the [dist folder](https://github.com/blinkjs/blink/tree/master/dist), also available as a [bower component](http://bower.io/search/?q=blink).

```bash
$ bower install --save blink
```

Include the script in your web page:

```html
<script src="/bower_components/blink/dist/blink.js"/>
```

Compile your block:

```js
var foo = new blink.Block('foo', { bar: 'baz' });
blink.compile(foo, function(err, css) {
  console.log(css);
});
```

You can also compile a string of source code as long as you export the rule with `exports`.

```js
var foo = "exports = new blink.Block('foo', { bar: 'baz' });";
blink.compile(foo, function(err, css) {
  console.log(css);
});
```


### OOCSS with BEM

Blink is designed with [BEM syntax][] in mind. You can create blocks, elements and modifiers and their CSS selectors will be generated for you. You can configure your BEM format however you want, but the default naming convention follows that which is defined in [MindBEMding &ndash; getting your head 'round BEM syntax][].

Here's an example of a block with both an element and a modifier:

```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');

var btn = new blink.Block('btn', {

	min: {
		width: 80
	},

	elements: [
		new blink.Element('foreground', {
			color: 'black'
		})
	],

	modifiers: [
		new blink.Modifier('wide', {
			min: {
				width: 120
			}
		})
	]
});

export = btn;
```

This would generate the following CSS:

```css
.btn {
	min-width: 80px;
}

.btn__foreground {
	color: black;
}

.btn--wide {
	min-width: 120px;
}
```


### Rules

The [Rule](https://github.com/blinkjs/blink/blob/master/lib/Rule.ts) class allows you to specify a standard CSS rule and can be useful when styling page defaults.


```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');

var normalize = [

	new blink.Rule('html', {
		font: {
			family: 'sans-serif'
		}
	}),

	new blink.Rule('body', {
		margin: 0
	}),

	new blink.Rule('a:active, a:hover', {
		outline: 0
	})

	// ...

];

export = normalize;
```

You are encouraged to use BEM blocks for all of your components. There's nothing stopping you from using basic rules, but you should avoid them if at all possible.


### Includes

Blink supports includes, but not in the way you might think. Includes are just functions that return an array of declarations. As such, you should lean against using them at all costs. Why? Say your include spits out 10 declarations. Every time you include that function you'll add another 10 lines of CSS to your file. Instead, use [extenders](#extenders) and [overrides](#overrides) when possible.

You might be wondering why blink supports includes at all if you aren't supposed to use them. This is because blink uses includes in the background to make [extenders](#extenders) work. As such, includes may be removed at a future date, if they can be worked out of the extender logic.

Still, if you find yourself needing an include, refer to [the Rule spec](https://github.com/blinkjs/blink/blob/master/test/spec/lib/Rule.spec.ts#L80-L97) for a working example.


### Mixins

If you're coming from [Sass](http://sass-lang.com/), you might be familiar with [mixins](http://sass-lang.com/guide). Really, Sass mixins are no different than functions in JavaScript; thus, blink supports them. All you have to do is create a function that returns an array of declarations. This is, in fact, how [extenders](#extenders) and [overrides](#overrides) work.


### Extenders

Extenders are named functions that return another function, complete with the original passed-in arguments as `args` and, optionally, `selectors`, for which you can find an example in [the clearfix extender](https://github.com/blinkjs/blink/blob/master/lib/extenders/clearfix.ts). An extender with no parameters always returns the same output. For example, here's an extender named `fill` that fills its container:

```ts
import blink = require('blink');

// ReSharper disable once UnusedLocals
function fill() {

	var extender = <blink.IExtender>(() => {
		return [
			['position', 'absolute'],
			['top', '0'],
			['right', '0'],
			['bottom', '0'],
			['left', '0']
		];
	});

	extender.args = arguments;
	return extender;

}

export = fill;
```

Let's create two blocks named `.foo` and `bar` that both extend fill.

```ts
var rules = [
	new blink.Block('foo', {
		extend: [ fill ]
	}),
	new blink.Block('bar', {
		extend: [ fill ]
	})
];

export = rules;
```

These two blocks share the same extender, so there's no reason to generate the same CSS twice. The above code would output the following:

```css
.foo, .bar {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}
```

This is very powerful, especially when you want to spit-out multiple declarations. Why, you ask? Because you only have to spit-out those declarations once! You can extend it from hundreds of blocks, but those lines never get written more than
once. This keeps your CSS as lean as possible.

Now, let's talk about building your own extenders. The basic structure of an extender is thus:

```ts
import blink = require('blink');

// ReSharper disable once UnusedLocals
function noop() {
	var extender = <blink.IExtender>(() => []);
	extender.args = arguments;
	return extender;
}

export = noop;
```

This extender, [as its name suggests, does nothing](http://www.urbandictionary.com/define.php?term=noop&defid=1183981).
The name, however, must be provided and must be unique.

In this case, the extender has no arguments; yet, they must also be returned for unique registration purposes.

Let's see what a more complicated, `inlineBlock` extender would look like.

```ts
import blink = require('blink');

// ReSharper disable once UnusedLocals
function inlineBlock() {
	var extender = <blink.IExtender>(() => {
		return ['display', 'inline-block'];
	});
}

export = inlineBlock;
```

This is all fine and good, but it's pretty useless. We can add a `verticalAlign` option to make it more dynamic.

```ts
import blink = require('blink');

// ReSharper disable once UnusedLocals
function inlineBlock(options?: {
		verticalAlign?: string;
	}) {

	options = options || {};

	var extender = <blink.IExtender>((config: blink.Configuration) => {
		var decs = [];

		decs.push(['display', 'inline-block']);

		if (options.verticalAlign !== null) {
			decs.push(['vertical-align', options.verticalAlign || 'middle']);
		}

		return decs;
	});

	extender.args = arguments;
	return extender;
}

export = inlineBlock;
```

Great, but what about inline-block CSS hacks? Glad you asked! You can gain access to the configuration for a case like this.

```ts
import blink = require('blink');

// ReSharper disable once UnusedLocals
function inlineBlock(options?: {
		verticalAlign?: string;
	}) {

	options = options || {};

	var extender = <blink.IExtender>((config: blink.Configuration) => {
		var decs = [];

		if (config.firefox < 3) {
			decs.push(['display', '-moz-inline-stack']);
		}

		decs.push(['display', 'inline-block']);

		if (options.verticalAlign !== null) {
			decs.push(['vertical-align', options.verticalAlign || 'middle']);
		}

		if (config.ie < 8) {
			decs.push(['*vertical-align', 'auto']);
			decs.push(['zoom', '1']);
			decs.push(['*display', 'inline']);
		}

		return decs;
	});

	extender.args = arguments;
	return extender;
}

export = inlineBlock;
```

Now, that's a nice extender! Once you change your configuration to support newer browsers, the CSS hacks disappear. No need to change any of your source code. It's all about the configuration.


#### Extender registration

It's important for you to know that, behind the scenes, blink is really smart about extender registration. It doesn't just register your extender by function name, but also by the arguments you pass in. This means if you extend `inlineBlock({ verticalAlign: 'top' })` 50 times and `inlineBlock({ verticalAlign: 'bottom' })` 20 times, only two rules will be generated. Different input yields different output, so it has to generate two rules for this scenario.


#### Extenders calling other extenders

Extenders can call other extenders directly, but you must provide the extender with the configuration object.

```ts
import blink = require('blink');

function boxSizing(value: string) {

	var extender = <blink.IExtender>(() => {
		return blink.extenders.experimental('box-sizing', value, {
			official: true,  // Opera/IE 8+
			  webkit: true,  // Safari/Chrome, other WebKit
			     moz: true   // Firefox, other Gecko
		})(config);
	});

	extender.args = arguments;
	return extender;

}
```

In this particular case, however, `box-sizing` would be better suited as an [Override](#overrides).


### Overrides

Overrides are functions &ndash; no different than extenders &ndash; that allow you to override a single CSS declaration with any number of declarations. In fact, you can and often will register extenders _as_ overrides. Here's an example of the
`box-sizing` extender above as an override:

```ts
import blink = require('blink');

// http://css-tricks.com/box-sizing/

// ReSharper disable once UnusedLocals
function boxSizing(value: string) {

	var override = <blink.IOverride>((config: blink.Configuration) => {
		return blink.config.extenders.experimental('box-sizing', value, {
			official: true,  // Opera/IE 8+
			  webkit: true,  // Safari/Chrome, other WebKit
			     moz: true   // Firefox, other Gecko
		})(config);
	});

	override.args = arguments;
	return override;

}

export = boxSizing;
```

Overrides are registered on the configuration object. If you wish to extend the configuration, you can do so by providing [a plugin module](#plugins).

_Note: override names are dasherized for you (e.g., boxSizing becomes box-sizing)._


### Responders

Responders currently only support [MediaAtRules](https://github.com/blinkjs/blink/blob/master/lib/MediaAtRule.ts), which allow you to create responsive websites. Here's an example of a basic responder:

```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');


var foo = new blink.Block('foo', {
	respond: [
		new blink.MediaAtRule('screen and (max-width: 320)', {
			width: 100
		})
	]
});

export = foo;
```

This generates the following CSS:

```css
@media screen and (max-width: 320) {
	.foo {
		width: 100px;
	}
}
```

[Unlike Sass](http://thesassway.com/intermediate/responsive-web-design-in-sass-using-media-queries-in-sass-32), at the time of this writing, blink supports extenders inside of media queries. Blink also merges similar media queries for you. So feel free to go crazy with some complicated responders!


### Plugins

Plugins can be defined in the configuration like so:

```json
{
  "plugins": ["yourname.overrides"]
}
```

If you were to publish an npm package under the name `yourname.overrides` and if you wanted to override the boxSizing override that blink already provides, you could do it like so:

```ts
function plugin() {
	this.overrides.boxSizing = require('./overrides/boxSizing');
	return this;
}
```

Now, every time someone declares `box-sizing: whatever` your override will be called with `whatever` as the first and only argument. The returned set of declarations will replace the original one. In this case, however, `box-sizing` does nothing with arguments.


### Node API

With all the new build tools and taks runners springing up, blink was built with that in mind, that various tools would need access to the compiled results without writing any files to the disk.


### TypeScript Source

Since blink source code is written in [TypeScript][], you don't need to constantly look-up documentation to gain insight as to how you can use the blink API. Unfortunately, although there is [TypeScript][] support for [other editors][], you won't get the powerful feature of Intellisense unless you are using [Visual Studio][].

BTW, you can write your blink files in [TypeScript][] or JavaScript. It really doesn't matter as long as it ends up in JavaScript.


## Getting Started


### CLI Usage

See [blink-cli](https://github.com/blinkjs/blink-cli)


### Library Usage

```bash
$ npm install --save-dev blink
```

```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');
```


Refer to the [blink TypeScript definition](https://github.com/blinkjs/blink/blob/master/blink.d.ts) for a list of available public methods.


### Spriting

As blink is built on Node.js, any spriting tools available for Node.js can be implemented quite easily. Some of these tools, like [Spritesmith][] allow you to not only generate sprites, but compute off the dimensions of the source images that build the sprites. This makes your CSS highly maintainable. For example, when Design gives you replacement images all you should have to do is drop them in the sprites folder without changing a single line of your blink source.


## License

Released under the MIT license.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/blinkjs/blink/trend.png)](https://bitdeli.com/free "Bitdeli Badge")



[Node.js]: http://nodejs.org/
[Node]: http://nodejs.org/
[BEM syntax]: http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/
[MindBEMding &ndash; getting your head 'round BEM syntax]: http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/
[TypeScript]: http://www.typescriptlang.org/
[other editors]: http://msopentech.com/blog/2012/10/01/sublime-text-vi-emacs-typescript-enabled/
[Visual Studio]: http://www.visualstudio.com/
[options]: https://github.com/blinkjs/blink/blob/master/lib/interfaces/IConfigurationOptions.ts
[stream]: http://nodejs.org/api/stream.html#stream_class_stream_readable
[err]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[config]: https://github.com/blinkjs/blink/blob/master/lib/interfaces/IConfigurationOptions.ts
[file]: https://github.com/blinkjs/blink/blob/master/lib/interfaces/IFile.ts
[Rule]: https://github.com/blinkjs/blink/blob/master/lib/Rule.ts
[Sass]: http://sass-lang.com/
[Spritesmith]: https://github.com/Ensighten/spritesmith

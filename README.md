<img src="https://github.com/blinkjs/blink/blob/master/artwork/blink_256_nobg.png?raw=true" width="256" height="256" alt="blink" align="right">

> Blink converts [Node.js][] modules into CSS and provides a CSS Authoring Framework, with BEM support.

[![Build Status][]](http://travis-ci.org/blinkjs/blink)
[![Dependency Status][]](https://gemnasium.com/blinkjs/blink)
[![NPM version][]](http://badge.fury.io/js/blink)
[![Views][]](https://sourcegraph.com/github.com/blinkjs/blink)

[![NPM](https://nodei.co/npm/blink.png?downloads=true)](https://nodei.co/npm/blink/)


## Requirements

- [Node][]


## Features

- [Runs on Node](#runs-on-node)
- [OOCSS with BEM Syntax](#oocss-with-bem)
- [Rules](#rules)
- [Includes](#includes)
- [Mixins](#mixins)
- [Extenders](#extenders)
- [Overrides](#overrides)
- [Responders](#responders)
- [TypeScript Source](#typescript-source)
- [CLI](https://github.com/blinkjs/blink-cli)
- [API](https://github.com/blinkjs/blink/blob/master/blink.d.ts)
- [gulp.js plugin](https://github.com/blinkjs/gulp-blink)
- [Grunt plugin](https://github.com/blinkjs/grunt-blink)
- Feature Roadmap
	- [Spriting](#spriting)


### Runs on Node

Because blink runs on [Node][], you have access to all JavaScript syntax, including
variables and functions, as well as [file I/O](http://nodejs.org/api/fs.html).
The possibilities are endless.


### OOCSS with BEM

Blink is designed with [BEM syntax][] in mind. You can create blocks, elements and
modifiers and their CSS selectors will be generated for you. You can configure
your BEM format however you want, but the default naming convention follows that
which is defined in [MindBEMding &ndash; getting your head 'round BEM syntax][].

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

All BEM classes extend off of the standard Rule class. The Rule class allows you to
specify a standard CSS rule and can be useful when styling page defaults.


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

You are encouraged to use BEM blocks for all of your components. There's nothing
stopping you from using basic rules, but you should avoid them if at all possible.


### Includes

Blink supports includes, but not in the way you might be used to. Includes are
just functions that return an array of declarations. As such, you should lean
against using them at all costs. Why? Say your include spits out 10 declarations.
Every time you include that function you'll add another 10 lines of CSS to your
file. Instead, use [extenders](#extenders) and [overrides](#overrides) when
possible.

You might be wondering why blink supports includes at all if you aren't supposed
to use them. This is because blink uses includes in the background to make
[extenders](#extenders) work. As such, includes may be removed at a future date,
if they can be worked out of the extender logic.

Still, if you find yourself needing an include, refer to
[the Rule spec](https://github.com/blinkjs/blink/blob/master/test/spec/lib/Rule.spec.ts#L80-L97)
for a working example.


### Mixins

If you're coming from [Sass](http://sass-lang.com/), you might be familiar with
[mixins](http://sass-lang.com/guide). Really, Sass mixins are no different than
functions in JavaScript; thus, blink supports them. All you have to do is create
a function that returns an array of declarations. This is, in fact, how
[extenders](#extenders) and [overrides](#overrides) work.


### Extenders

Extenders are named functions that return an array that is described in more detail
below. An extender with no parameters always returns the same output. For example,
here's an extender named fill that fills its container:

```ts
export function fill(): any[] {
	return [arguments, () => {
		return [
			['position', 'absolute'],
			['top', '0'],
			['right', '0'],
			['bottom', '0'],
			['left', '0']
		];
	}];
}
```

Let's create two blocks named `.foo` and `bar` that both extend fill.

```ts
console.log(blink.compileRules([
	new blink.Block('foo', {
		extend: [ fill ]
	}),
	new blink.Block('bar', {
		extend: [ fill ]
	})
]));
```

These two blocks share the same extender, so there's no reason to generate the
same CSS twice. The above code would output the following:

```css
.foo, .bar {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
}
```

This is very powerful, especially when you want to spit-out multiple declarations.
Why, you ask? Because you only have to spit-out those declarations once! You can
extend it from hundreds of blocks, but those lines never get written more than
once. This keeps your CSS as lean as possible.

Now, let's talk about building your own extenders. The basic structure of an
extender is thus:

```ts
export function nothing(): any[] {
	return [arguments, () => {
		return [];
	}];
}
```

This extender, as its name suggests, does nothing. The name, however, must be
provided and must be unique.

In this case, the extender has no arguments; yet, they must also be returned for
unique registration purposes.

Let's see what a more complicated, inlineBlock extender would look like.

```ts
export function inlineBlock(): any[] {
	return [arguments, () => {
		return ['display', 'inline-block'];
	}];
}
```

This is all fine and good, but it's pretty useless. We can add a verticalAlign
option to make it more dynamic.

```ts
export function inlineBlock(options?: { verticalAlign?: string }): any[] {

	options = options || {};

	return [arguments, () => {
		var decs = [];
		decs.push(['display', 'inline-block']);

		if (options.verticalAlign !== null) {
			decs.push(['vertical-align', options.verticalAlign || 'middle']);
		}

		return decs;
	}];
}
```

Great, but what about inline-block CSS hacks? Glad you asked! You can gain access
to the configuration for a case like this.

```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');

function inlineBlock(options?: { verticalAlign?: string; }): any[] {

	options = options || {};

	return [arguments, (config: blink.Configuration) => {
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
	}];
}
```

Now, that's a nice extender! Once you change your configuration to support newer
browsers, the CSS hacks disappear. No need to change any of your source code. It's
all about the configuration.


#### Extender registration

It's important for you to know that, behind the scenes, blink is really smart
about extender registration. It doesn't just register your extender by function
name, but also by the arguments you pass in. This means if you extend
`inlineBlock({ verticalAlign: 'top' })` 50 times and
`inlineBlock({ verticalAlign: 'bottom' })` 20 times, only two rules will be
generated. Different input yields different output, so it has to generate two
rules for this scenario.


#### Extenders calling other extenders

Extenders can call other extenders directly, but you must provide the extender
with the configuration.

```ts
import blink = require('blink');

function boxSizing(value: string): any[] {
	return [arguments, (config: blink.Configuration) => {
		return blink.extenders.experimental('box-sizing', value, {
			official: true,  // Opera/IE 8+
				webkit: true,  // Safari/Chrome, other WebKit
					 moz: true   // Firefox, other Gecko
		})[1](config);
	}];
}
```

Notice that index 1 accessed the extender function. When calling an extender
directly the arguments become useless, so we throw them away.


### Overrides

Overrides are functions &ndash; no different than extenders &ndash; that allow you
to override a single CSS declaration with any number of declarations. In fact, you
can and often will register extenders _as_ overrides. Overrides are registered on
the configuration object. For example, say we want the box-sizing extender above
to be registered as an override:

```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');

var overrides = blink.config.overrides;

overrides['box-sizing'] = require('./lib/extenders/boxSizing');
// Register more overrides here.
```

_Note: override keys are not dasherized for you._

Now, every time someone declares `box-sizing: whatever` your override will be
called with `whatever` as the first and only argument. The returned set of
declarations will replace the original one.


### Responders

Responders currently only support
[MediaAtRules](https://github.com/blinkjs/blink/blob/master/lib/MediaAtRule.ts),
which allow you to create responsive websites. Here's an example of a basic
responder:

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

[Unlike Sass](http://thesassway.com/intermediate/responsive-web-design-in-sass-using-media-queries-in-sass-32),
at the time of this writing, blink supports extenders inside of media queries.
Blink also merges similar media queries for you. So feel free to go to town with
some complicated responders!


### Node API

With all the new build tools and taks runners springing up, blink was built with
that in mind, that various tools would need access to the compiled results without
writing any files to the disk.


### TypeScript Source

Since blink source code is written in [TypeScript][], you don't need to constantly
look-up documentation to gain insight as to how you can use the blink API.
Unfortunately, although there is [TypeScript][] support for [other editors][], you
won't get the powerful feature of Intellisense unless you are using
[Visual Studio][].

BTW, you can write your blink files in [TypeScript][] or JavaScript. It really
doesn't matter as long as it ends up in JavaScript.


## Getting Started


### CLI Usage

```bash
$ npm install -g blink
```


### Library Usage

```bash
$ npm install --save-dev blink
```

```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');
```

Refer to the [blink module](https://github.com/blinkjs/blink/blob/master/blink.d.ts)
for a list of available public methods. Of particular interest are the compile
methods:

- compile([options][], sources, callback)
	- sources can be any of string, [file][] array, [stream][] or [Rule][].
- compileStream([options][], [stream][], callback)
- compileContents([options][], [file][], callback)

All callbacks have the following function signature:
- callback([err][], [config][], [file][])


### Spriting

On the feature roadmap is the ability to not only generate sprites, but to compute
off the dimensions of the source images that build sprites. To this date, the only
tool to my knowledge that has this feature is [Compass](http://compass-style.org/).
See [Spriting with Compass](http://compass-style.org/help/tutorials/spriting/).


## License

Released under the MIT license.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/blinkjs/blink/trend.png)](https://bitdeli.com/free "Bitdeli Badge")



[Build Status]: https://secure.travis-ci.org/blinkjs/blink.png?branch=master
[Dependency Status]: https://gemnasium.com/blinkjs/blink.png
[NPM version]: https://badge.fury.io/js/blink.png
[Views]: https://sourcegraph.com/api/repos/github.com/blinkjs/blink/counters/views-24h.png
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
[Compass]: http://compass-style.org/

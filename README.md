<img src="https://github.com/blinkjs/blink/blob/master/artwork/blink_256.png?raw=true" width="256" height="256" alt="blink">

> Blink converts [Node.js][] modules into CSS and provides a CSS Authoring Framework, with BEM support.

[![Build Status][]](http://travis-ci.org/blinkjs/blink)
[![Dependency Status][]](https://gemnasium.com/blinkjs/blink)
[![NPM version][]](http://badge.fury.io/js/blink)
[![Views][]](https://sourcegraph.com/github.com/blinkjs/blink)

[![NPM](https://nodei.co/npm/blink.png?downloads=true)](https://nodei.co/npm/blink/)


## Requirements

- [Node][]


## Features

- Runs on [Node][]
- OOCSS with [BEM syntax][]
- Extenders
- Overrides
- Rules
- API
- TypeScript source


### Feature Roadmap

- Responders
- Spriting


### Runs on Node

Because blink runs on [Node][], you have access to all JavaScript syntax, including
variables and functions, as well as [file I/O](http://nodejs.org/api/fs.html).
The possibilities are endless.


### OOCSS with BEM

Blink is designed with [BEM syntax][] in mind. You can create blocks, elements and
modifiers and their CSS selectors will be generated for you. You can configure
your BEM format however you want, but the default naming convention follows that
which is defined in [MindBEMding � getting your head 'round BEM syntax][].

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


#### Where are the includes and mixins?

You might be wondering if blink supports includes and mixins. The answer is yes
and no. It is a blink philosophy that includes have traditionally been used in
cases where extension was more appropriate. As such, the include paradigm has been
included in the extenders themselves. All you have to do is extend everything
and blink will determine whether your extension can be shared across rules or not.
It's just one less thing for you to worry about and it results in automatically
leaner CSS.

As for mixins, they are really no different than functions, which are made
available to you in normal JavaScript syntax.

That said, you can, technically, include extenders in your rules. That is how
blink works behind the scenes, so it does work, but it's undocumented,
unsupported and encouraged against. If you come up with a valid use case, open
an issue and it will be discussed.


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


### Rules

Outside of BEM blocks, you'll definitely need to write rules for page defaults.
For this, a Rule class is made available to you:

```ts
///<reference path="./node_modules/blink/blink.d.ts"/>
import blink = require('blink');

var normalize = [

	new blink.Rule(['html'], {
		font: {
			family: 'sans-serif'
		}
	}),

	new blink.Rule(['body'], {
		margin: 0
	}),

	new blink.Rule(['a:active', 'a:hover'], {
		outline: 0
	})

	// ...

];

export = normalize;
```

You are encouraged to use BEM blocks for all of your components. There's nothing
stopping you from using basic rules, but you should avoid them if at all possible.


### Node API

With all the new build tools and taks runners springing up, blink was built with
that in mind, that various tools would need access to the compiled results without
writing any files to the disk.


### TypeScript source

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


#### compile(options: IConfigurationOptions, files: string[], callback: (exitCode: number) => void): void


#### Compiler(public config?: Configuration)


##### compile(files: string[], callback: (err: Error, results?: ICompiledResult[]) => void): void


##### compileRules(rules: Rule[]): string


#### ICompiledResult

```ts
interface ICompiledResult {
	src: string;
	dest: string;
	contents: string;
}
```

#### IConfigurationOptions

```ts
interface IConfigurationOptions {

	config?: string;

	// Output style
	style?: string;
	oneIndent?: string;
	quote?: string;
	newline?: string;

	// BEM
	block?: string;
	element?: string;
	modifier?: string;

	// Cross-Browser Support
	chrome?: number;
	firefox?: number;
	ie?: number;
	opera?: number;

}
```


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
[MindBEMding � getting your head 'round BEM syntax]: http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/
[TypeScript]: http://www.typescriptlang.org/
[other editors]: http://msopentech.com/blog/2012/10/01/sublime-text-vi-emacs-typescript-enabled/
[Visual Studio]: http://www.visualstudio.com/

[Sass]: http://sass-lang.com/
[Compass]: http://compass-style.org/

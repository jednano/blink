/// <reference path="./bower_components/dt-node/node.d.ts" />

declare module "blink" {
	var config: Configuration;
	class Configuration implements IConfigurationOptions {
		constructor(options?: IConfigurationOptions);
		public clone(): Configuration;
		public set(options: IConfigurationOptions): Configuration;
		private loadConfig(filename);
		public raw: IConfigurationOptions;
		public toString(): string;
		public config: string;
		public quiet: boolean;
		public trace: boolean;
		public force: boolean;
		public boring: boolean;
		public style: string;
		public oneIndent: any;
		public newline: string;
		public quote: string;
		public oneSpace: string;
		public declarationSeparator: string;
		public ruleSeparator: any;
		public block: string;
		public element: string;
		public modifier: string;
		public chrome: number;
		public firefox: number;
		public ie: number;
		public opera: number;
		public webkitPrefix: boolean;
		public khtmlPrefix: boolean;
		public mozPrefix: boolean;
		public msPrefix: boolean;
		public oPrefix: boolean;
		public overrides: any;
	}
	function compile(options: IConfigurationOptions, sources: any[], callback?: (err: Error, config: Configuration, file: IFile) => void): void;
	function compileStream(options: IConfigurationOptions, stream: any, callback?: (err: Error, config: Configuration, file: IFile) => void): void;
	function compileContents(options: IConfigurationOptions, file: {
		src?: string;
		contents: string;
	}, callback?: (err: Error, config: Configuration, file: IFile) => void): void;
	interface IFile {
		src?: string;
		dest?: string;
		contents?: string;
	}
	class Rule {
		public body: IRuleBody;
		private config;
		private decs;
		public extenders: any[];
		public includes: Function[];
		public selectors: string[];
		constructor(selectors: any, body?: IRuleBody);
		private splitSelectors(selectors);
		public resolve(config: Configuration): any[][];
		private joinSelectors(left, right);
		public clone(): Rule;
		private resolveIncludes();
		private resolveBody(seed, key, body);
		private combineKeys(k1, k2);
		private isDeclarationValue(value);
		private compileDeclarationValue(value);
		private compileArray(arr);
		private compilePrimitive(value);
		public compile(config: Configuration): string;
	}
	class Block {
		public name: string;
		private declarations;
		public elements: Element[];
		public modifiers: Modifier[];
		constructor(name: string, declarations: IBlockDeclarations);
		public compile(config: Configuration): string;
	}

	class Compiler {
		public config: Configuration;
		constructor(config?: Configuration);
		public compile(sources: any[], callback: (err: Error, file?: IFile) => void): void;
		private tryCompileRule(rule, callback);
		private compileFile(file, callback);
		public compileStream(stream: NodeJS.ReadableStream, callback: (err: Error, file?: IFile) => void): void;
		private readStream(stream, callback);
		public tryCompileContents(file: IFile, callback: (err: Error, file?: IFile) => void): void;
		private renameExtToCss(file);
		private compileModule(contents, folder);
		public compileRules(rules: Rule[]): string;
		private compileExtenders(rules);
	}
	class Element {
		public name: string;
		private declarations;
		public modifiers: Modifier[];
		constructor(name: string, declarations: IElementDeclarations);
		public compile(selector: string, config: Configuration): string;
	}
	class Modifier {
		public name: string;
		private declarations;
		public elements: Element[];
		constructor(name: string, declarations: IModifierDeclarations);
		public compile(selector: string, config: Configuration): string;
	}
	interface IConfigurationOptions {
		config?: string;
		quiet?: boolean;
		trace?: boolean;
		force?: boolean;
		boring?: boolean;
		style?: string;
		oneIndent?: string;
		quote?: string;
		newline?: string;
		block?: string;
		element?: string;
		modifier?: string;
		chrome?: number;
		firefox?: number;
		ie?: number;
		opera?: number;
		webkitPrefix?: boolean;
		khtmlPrefix?: boolean;
		mozPrefix?: boolean;
		msPrefix?: boolean;
		oPrefix?: boolean;
	}
	interface IBlockDeclarations extends IRuleBody {
		elements?: Element[];
		modifiers?: Modifier[];
	}
	interface IElementDeclarations extends IRuleBody {
		modifiers?: Modifier[];
	}
	interface IModifierDeclarations extends IRuleBody {
		elements?: Element[];
	}
	interface IRuleBody extends IHashTable<any> {
		extend?: any[];
		include?: Function[];
	}
	interface IHashTable<T> {
		[key: string]: T;
	}
}

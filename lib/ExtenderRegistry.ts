import IHashTable = require('./interfaces/IHashTable');


class ExtenderRegistry {

	private extenders: IHashTable<Function> = {};
	private selectors: IHashTable<string[]> = {};

	public get(extender: Function) {
		return this.selectors[this.getName(extender)];
	}

	private getName(extender: Function) {
		return (<any>extender).name;
	}

	public add(extender: Function, selectors: string[]) {
		var key = this.getName(extender);
		if (!this.exists(extender)) {
			this.extenders[key] = extender;
		}
		this.selectors[key] = this.selectors[key] || [];
		Array.prototype.push.apply(this.selectors[key], selectors);
	}

	public exists(extender: Function) {
		return this.extenders.hasOwnProperty(this.getName(extender));
	}

	public forEach(callback: (extender: Function, selectors: string[]) => void) {
		Object.keys(this.extenders).forEach(key => {
			callback(this.extenders[key], this.selectors[key]);
		});
	}

	public map(callback: (extender: Function, selectors: string[]) => void) {
		var result = [];
		this.forEach((extender, selectors) => {
			result.push(callback(extender, selectors));
		});
		return result;
	}

}

export = ExtenderRegistry;

import Extender = require('./interfaces/Extender');
import HashTable = require('./interfaces/HashTable');


class ExtenderRegistry {

	private extenders: HashTable<Extender> = {};
	private selectors: HashTable<string[]> = {};

	public add(extender: Extender, selectors: string[]) {
		var key = this.createKey(extender);
		if (!this.extenders.hasOwnProperty(key)) {
			this.extenders[key] = extender;
			this.selectors[key] = [];
		}
		Array.prototype.push.apply(this.selectors[key], selectors);
	}

	private createKey(extender: Extender) {
		var args = extender.args;
		var extenderName = (<any>args.callee).name;
		var serializedArgs = JSON.stringify(Array.prototype.slice.call(args, 0));
		return extenderName + serializedArgs;
	}

	public forEach(callback: (extender: Extender, selectors: string[]) => void) {
		Object.keys(this.extenders).forEach(key => {
			callback(this.extenders[key], this.selectors[key]);
		});
	}

	public map(callback: (extender: Extender, selectors: string[]) => void) {
		var result = [];
		this.forEach((extender, selectors) => {
			result.push(callback(extender, selectors));
		});
		return result;
	}

}

export = ExtenderRegistry;

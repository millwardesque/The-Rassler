class Registry {
	constructor() {
		this.registry = {};
	}

	set(key, value) {
		this.registry[key] = value;
	}

	append(key, value) {
		if (Array.isArray(this.registry[key])) {
			this.registry[key].push(value);
		}
		else if (!this.hasOwnProperty(key)) {
			this.registry[key] = [];
			this.registry[key].push(value);
		}
		else {
			throw new Error(`[Registry] Unable to append '${value}' to '${key}'`);
		}
	}

	findValue(key) {
		let tokens = key.split('.');

		let root = tokens.shift();
		if (root in this.registry) {
			let currentObject = this.registry[root];
			for (let token of tokens) {
				if (token in currentObject) {
					if (typeof(currentObject[token]) === "function") {
						currentObject = currentObject[token].call(currentObject);
					}
					else {
						currentObject = currentObject[token];
					}
				}
				else {
					return null;
				}
			}

			if (typeof(currentObject) === "function") {
				return currentObject.call(currentObject);
			}
			else {
				return currentObject;
			}
		}
	}
}

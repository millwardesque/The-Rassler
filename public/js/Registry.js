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
}
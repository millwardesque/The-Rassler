class Storage extends GameObject {
	constructor(id) {
		super(id);
	}

	setItem(name, value) {
		return new Promise(async function(resolve, reject) {
			reject("setItem not overridden by subclass.");
		});
	}

	getItem(name) {
		return new Promise(async function(resolve, reject) {
			reject("getItem not overridden by subclass.");
		});
	}

	removeItem(name) {
		return new Promise(async function(resolve, reject) {
			reject("removeItem not overridden by subclass.");
		});
	}

	static getStorageEngine() {
		return new WebStorage('Storage Engine');
	}
}

/**
 * Stub class for faking storage capabilities.
 */
class NullStorage extends Storage {
	constructor(id) {
		super(id);
	}

	setItem(name, value) {
		this.log(`Setting ${name}`, value);
		return Promise.resolve();
	}

	getItem(name) {
		this.log(`Getting ${name}`);
		return Promise.resolve();
	}

	removeItem(name) {
		this.log(`Removing ${name}`);
		return Promise.resolve();
	}
}

/**
 * Storage engine using the webserver.
 */
class WebStorage extends Storage {
	constructor(id) {
		super(id);
	}

	setItem(name, value) {
		this.warning(`Unable to set ${name}: Web storage can't do this yet.`, value);
		return Promise.resolve();
	}

	getItem(name) {
		let self = this;
		return new Promise(async function (resolve, reject) {
			try {
				self.log(`Loading item '${name}'`);
				let response = await webUtils.getRequest(`/gameData/${name}`);
				response = JSON.parse(response);

				self.log(`Loaded item '${name}'`);
				resolve(response);
			}
			catch (err) {
				reject(err);
			}
		});
	}
}
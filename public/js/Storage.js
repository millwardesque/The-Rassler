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
		return new ServerStorage('Storage Engine');
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
		this.debug(`[FAKE] Setting item '${name}'`, value);
		return Promise.resolve();
	}

	getItem(name) {
		this.debug(`[FAKE] Getting item '${name}'`);
		return Promise.resolve();
	}

	removeItem(name) {
		this.debug(`[FAKE] Removing item '${name}'`);
		return Promise.resolve();
	}
}

class LocalStorage extends Storage {
	constructor(id) {
		super(id);

		if (!window.localStorage) {
			throw new Exception("Unable to instantatiate LocalStorage: Current environment doesn't support localStorage");
		}

		this.localStorage = window.localStorage;
	}

	setItem(name, value) {
		this.debug(`Setting item '${name}'`, value);
		this.localStorage.setItem(name, JSON.stringify(value));
		this.debug(`Set item '${name}'`);
		return Promise.resolve();
	}

	getItem(name) {
		this.debug(`Getting item '${name}'`);
		let item = this.localStorage.getItem(name);
		item = JSON.parse(item);
		this.debug(`Got item '${name}'`, item);

		return Promise.resolve(item);
	}

	removeItem(name) {
		this.debug(`Removing item '${name}'`);
		this.localStorage.removeItem(name);
		this.debug(`Removed item '${name}'`);

		return Promise.resolve();
	}
}

/**
 * Storage engine using the webserver.
 */
class ServerStorage extends Storage {
	constructor(id) {
		super(id);
	}

	setItem(name, value) {
		this.debug(`Setting item '${name}'`, value);
		(new NullStorage()).setItem(name, value);
		this.debug(`Set item '${name}'`);

		return Promise.resolve();
	}

	getItem(name) {
		let self = this;
		return new Promise(async function (resolve, reject) {
			try {
				self.debug(`Getting item '${name}'`);
				let response = await webUtils.getRequest(`/gameData/${name}`);
				response = JSON.parse(response);

				self.debug(`Got item '${name}'`, response);
				resolve(response);
			}
			catch (err) {
				reject(err);
			}
		});
	}

	removeItem(name) {
		this.debug(`Removing item '${name}'`);
		(new NullStorage()).removeItem(name);
		this.debug(`Removed item '${name}'`);
		
		return Promise.resolve();
	}
}
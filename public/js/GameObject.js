class GameObject {
	constructor(id) {
		this.id = id;
		this.isEnabled = true;
	}

	enable() {
		this.isEnabled = true;
		this.onEnable();
	}

	disable() {
		this.isEnabled = false;
		this.onDisable();
	}

	onEnable() {
		/** Overwrite in subclasses */
	}

	onDisable() {
		/** Overwrite in subclasses */
	}

	log(message, data) {
		Log.log(this.fullId, message, data);
	}

	debug(message, data) {
		Log.debug(this.fullId, message, data);
	}

	get fullId() {
		return `${this.constructor.name}#${this.id}`;
	}
}
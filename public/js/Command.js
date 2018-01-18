class Command extends GameObject {
	constructor(id, label, nextScene) {
		super(id);

		this.id = id;
		this.label = label;
		this.nextScene = nextScene;

		engine.eventDispatcher.addListener(this.executeCommandEventName, this);
	}

	execute(gameWorld) { 
		// Overrideable for custom command behaviour
	}

	handleEvent(gameEvent) {
		if (gameEvent.id == this.executeCommandEventName) {
			this.execute(gameEvent.gameWorld);

			if (this.nextScene) {
				engine.eventDispatcher.dispatchEvent(new GameEvent("Load Scene", this.nextScene));
			}
		}
	}

	get executeCommandEventName() {
		return "Execute Command-" + this.id;
	}

	/**
	 * Loads a command via an object literal instead of a list of params
	 */
	static load(obj) {
		try {
			let command = new Command(obj.id, obj.label, obj.nextScene)
			if (obj.hasOwnProperty('isEnabled')) {
				command.isEnabled = obj.isEnabled;
			}
			return command;
		}
		catch(err) {
			throw new Error(`Unable to load command from object: ${err}`);
		}
	}
}
class Command extends GameObject {
	constructor(id, label, nextSceneNode) {
		super(id);

		this.id = id;
		this.label = label;
		this.nextSceneNode = nextSceneNode;

		engine.eventDispatcher.addListener(this.executeCommandEventName, this);
	}

	execute(gameWorld) { 
		// Overrideable for custom command behaviour
	}

	handleEvent(gameEvent) {
		if (gameEvent.id == this.executeCommandEventName) {
			console.log(this);
			this.execute(gameEvent.gameWorld);

			if (this.nextSceneNode) {
				engine.eventDispatcher.dispatchEvent(new GameEvent("Activate Scene Node", this.nextSceneNode));
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
			let command = new Command(obj.id, obj.label, obj.nextSceneNode)
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
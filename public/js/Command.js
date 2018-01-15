class Command {
	constructor(id, label, nextScene) {
		this.id = id;
		this.label = label;
		this.nextScene = nextScene;

		engine.eventDispatcher.addListener(this.executeCommandName, this);
	}

	execute(gameWorld) { 
		// Overrideable for custom command behaviour
	}

	handleEvent(gameEvent) {
		console.log(gameEvent);
		console.log(gameEvent.id + ": HERE : " + this.executeCommandName);
		if (gameEvent.id == this.executeCommandName) {
			this.execute(gameEvent.gameWorld);

			if (this.nextScene) {
				engine.eventDispatcher.dispatchEvent(new GameEvent("Load Scene", this.nextScene));
			}
		}
	}

	get executeCommandName() {
		return "Execute Command-" + this.id;
	}

	static load(obj) {
		try {
			return new Command(obj.id, obj.label, obj.nextScene)
		}
		catch(err) {
			throw new Error(`Unable to load command from object: ${err}`);
		}
	}
}
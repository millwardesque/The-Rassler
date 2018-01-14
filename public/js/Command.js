class Command {
	constructor(name, label) {
		this.name = name;
		this.label = label;

		engine.eventDispatcher.addListener(this.executeCommandName, this);
	}

	execute(gameWorld) {
		throw new Error("You must override the execute() method when inheriting the Command class.");
	}

	handleEvent(gameEvent) {
		if (gameEvent.name == this.executeCommandName) {
			this.execute(gameEvent.gameWorld);
		}
	}

	get executeCommandName() {
		return "Execute Command-" + this.name;
	}
}
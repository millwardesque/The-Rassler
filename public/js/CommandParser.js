class CommandParser  extends GameObject {
	constructor(id) {
		super(id);

		this.canUseCustomCommands = false;

		engine.eventDispatcher.addListener(GameEvents.OnUserCommand, this);
		engine.eventDispatcher.addListener(GameEvents.ToggleCustomCommands, this);
	}

	handleEvent(event) {
		if (event.id == GameEvents.OnUserCommand && this.canUseCustomCommands) {
			let command = event.data;
			this.log(`User command: ${command}`);
		}
		else if (event.id == GameEvents.ToggleCustomCommands) {
			this.canUseCustomCommands = event.data;
		}
	}
}
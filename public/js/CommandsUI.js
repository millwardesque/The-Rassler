class CommandsUI extends GameObject{
	constructor(id, container) {
		super(id);

		if (container == null) {
			throw new Error("Null container passed to constructor.");
		}

		this.container = container;
		engine.eventDispatcher.addListener(GameEvents.OnSceneNodeChange, this);
	}

	handleEvent(event) {
		if (event.id == GameEvents.OnSceneNodeChange) {
			this.render(event.data.commands);
		}
	}

	render(commands) {
		webUtils.removeAllChildren(this.container);
		for (let command of commands) {
			this.renderCommand(command);
		}
	}

	renderCommand(command) {
		let commandNode = webUtils.cloneTemplate('command');
		let label = GameUtils.processTemplate(command.label);
		commandNode.querySelector('.label').textContent = label;

		commandNode.addEventListener('click', function(clickEvent) {
			engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.ExecuteCommand, command));
		});

		this.container.appendChild(commandNode);
	}
}
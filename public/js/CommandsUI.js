class CommandsUI {
	constructor(container) {
		if (container == null) {
			throw new Error("Null container passed to constructor.");
		}

		this.container = container;
		engine.eventDispatcher.addListener('Scene Change', this);
	}

	handleEvent(event) {
		if (event.name == "Scene Change") {
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
		commandNode.querySelector('.label').textContent = command.label;

		commandNode.addEventListener('click', function(clickEvent) {
			engine.eventDispatcher.dispatchEvent(new GameEvent('Execute Command-' + command.name));
		});

		this.container.appendChild(commandNode);
	}
}
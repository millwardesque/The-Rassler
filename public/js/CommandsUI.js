class CommandsUI {
	constructor(container) {
		if (container == null) {
			throw new Error("Null container passed to constructor.");
		}

		this.container = container;
		engine.eventDispatcher.addListener('Scene Change', this);
	}

	handleEvent(event) {
		if (event.id == "Scene Change") {
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
		console.log(command.label);
		let label = GameUtils.processTemplate(command.label);
		commandNode.querySelector('.label').textContent = label;

		commandNode.addEventListener('click', function(clickEvent) {
			engine.eventDispatcher.dispatchEvent(new GameEvent('Execute Command-' + command.id));
		});

		this.container.appendChild(commandNode);
	}
}
class CommandsUI extends GameObject{
	constructor(id, container) {
		super(id);

		if (container == null) {
			throw new Error("Null container passed to constructor.");
		}

		this.container = container;
		this.canUseCustomCommands = false;

		engine.eventDispatcher.addListener(GameEvents.OnSceneNodeChange, this);
		engine.eventDispatcher.addListener(GameEvents.ToggleCustomCommands, this);
		engine.eventDispatcher.addListener(GameEvents.UpdateCommandsUI, this);
	}

	handleEvent(event) {
		if (event.id == GameEvents.OnSceneNodeChange) {
			this.render(event.data.commands);
		}
		else if (event.id == GameEvents.UpdateCommandsUI) {
			this.render(event.data.commands);
		}
		else if (event.id == GameEvents.ToggleCustomCommands) {
			this.canUseCustomCommands = event.data;
		}
	}

	/**
	 * Renders the commands UI.
	 */
	render(commands) {
		webUtils.removeAllChildren(this.container);
		for (let command of commands) {
			this.renderCommand(command);
		}

		if (this.canUseCustomCommands) {
			this.renderCustomCommand();
		}
	}

	/**
	 * Renders a prescribed command (e.g. a line of dialogue the user could speak)
	 */
	renderCommand(command) {
		let commandNode = webUtils.cloneTemplate('command');
		let label = GameUtils.processTemplate(command.label);
		commandNode.querySelector('.label').textContent = label;

		commandNode.addEventListener('click', function(clickEvent) {
			clickEvent.preventDefault();
			clickEvent.stopPropagation();

			engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.ExecuteCommand, command));
		});

		this.container.appendChild(commandNode);
	}

	/**
	 * Renders a custom command form.
	 */
	renderCustomCommand() {
		let commandNode = webUtils.cloneTemplate('custom-command');
		let randomId = Math.floor(Math.random * 10000000);
		let formId = "custom-command-form_" + randomId;
		let fieldId = "custom-command_" + randomId;

		let form = commandNode.querySelector('form');
		form.id = formId;

		let field = commandNode.querySelector('#custom-command');
		field.id = fieldId;

		form.addEventListener('submit', (submitEvent) => {
			let userCommand = webUtils.stripHtml(field.value);

			if (userCommand == "") {
				return;
			}

			engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.OnUserCommand, userCommand));

			field.value = "";

			submitEvent.preventDefault();
			submitEvent.stopPropagation();
		});

		this.container.appendChild(commandNode);
	}
}
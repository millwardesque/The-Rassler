class SceneNodeEditorUI extends GameObject{
	constructor(id, container) {
		super(id);

		if (container == null) {
			throw new Error("Null container passed to constructor.");
		}

		this.container = container;
		engine.eventDispatcher.addListener(GameEvents.OnSceneNodeLoadEditor, this);
	}

	handleEvent(event) {
		if (event.id == GameEvents.OnSceneNodeLoadEditor) {
			this.renderSceneNode(event.data);
		}
	}

	renderSceneNode(sceneNode) {
		let sceneNodeElement = webUtils.cloneTemplate('sceneNode');

		sceneNodeElement.querySelector('.sceneNode-id').value = sceneNode.id;
		sceneNodeElement.querySelector('.sceneNode-description').value = sceneNode.description;

		for (let command of sceneNode.commands) {
			let commandElement = webUtils.cloneTemplate('sceneNode-command');
			commandElement.querySelector('.sceneNode-command-label').value = command.label;

			if (command.nextSceneNode) {
				commandElement.querySelector('.sceneNode-command-next-scene-node').value = command.nextSceneNode;
			}
			else {
				let nextNodeElement = commandElement.querySelector('.sceneNode-command-next-scene-node').parentNode;
				webUtils.hideElement(nextNodeElement);
			}

			// @TODO Set form IDs

			sceneNodeElement.querySelector('.sceneNode-commands').appendChild(commandElement);
		}

		// @TODO Set form IDs
		// @TODO Submit button click.

		this.container.appendChild(sceneNodeElement);
	}
}
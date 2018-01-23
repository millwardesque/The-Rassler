class Scene extends GameObject{
	constructor(id, nodes) {
		super(id);
		this.nodes = nodes;

		engine.eventDispatcher.addListener("Activate Scene Node", this);
	}

	handleEvent(event) {
		if (event.id == "Activate Scene Node") {
			this.activateSceneNode(event.data);
		}
	}

	activateSceneNode(sceneNodeId) {
		for (let node of this.nodes) {
			if (node.id == sceneNodeId) {
				engine.eventDispatcher.dispatchEvent(new GameEvent("SceneNode Change", node));
				return;	
			}
		}

		throw new Error(`SceneNode '${sceneNodeId}' wasn't found`);
	}

	static load(sceneData) {
		try {
			let sceneId = sceneData.id;

			let nodes = new Array();
			for (let node of sceneData.nodes) {
				let commands = [];

				for (let i in node.commands) {
					let command = node.commands[i];
					command.id = `SceneNode-${node.id}-Command-${i}`;
					command.isEnabled = false;
					commands.push(Command.load(command));
				}
				let sceneNode = new SceneNode(node.id, node.description, commands);
				nodes.push(sceneNode);
			}

			let scene = new Scene(sceneId, nodes);

			console.log(`[Scene] Loaded '${sceneId}'`);
			return scene;
		}
		catch(err) {
			throw new Error(`Unable to load scene: ${err}`);
		}
	}
}
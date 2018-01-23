class Scene extends GameObject{
	constructor(id, nodes) {
		super(id);
		this.nodes = nodes;

		for (let node of this.nodes) {
			node.parentScene = this;
		}

		engine.eventDispatcher.addListener("Activate Scene Node", this);
	}

	handleEvent(event) {
		if (event.id == "Activate Scene Node" && event.data.sceneId == this.id) {
			this.activateSceneNode(event.data.nodeId);
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
				let sceneNode = new SceneNode(node.id, null, node.description, commands);
				nodes.push(sceneNode);
			}

			let scene = new Scene(sceneId, nodes);
			return scene;
		}
		catch(err) {
			throw new Error(`Unable to load scene: ${err}`);
		}
	}
}
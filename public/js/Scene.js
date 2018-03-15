class Scene extends GameObject{
	constructor(id, nodes, prerequisites = []) {
		super(id);

		this.nodes = nodes;
		for (let node of this.nodes) {
			node.parentScene = this;
		}

		this.prerequisites = prerequisites;

		engine.eventDispatcher.addListener(GameEvents.ActivateSceneNode, this);
	}

	handleEvent(event) {
		if (event.id == GameEvents.ActivateSceneNode && event.data.sceneId == this.id) {
			this.activateSceneNode(event.data.nodeId);
		}
	}

	activateSceneNode(sceneNodeId) {
		if (sceneNodeId == "<end>") {
			this.endScene();
			return;
		}
		else {
			for (let node of this.nodes) {
				if (node.id == sceneNodeId) {
					engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.OnSceneNodeChange, node));
					return;
				}
			}
		}

		throw new Error(`SceneNode '${sceneNodeId}' wasn't found`);
	}

	endScene() {
		engine.registry.set(`scene complete: ${this.id}`, true);
		engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.OnSceneEnd, { scene: this }));
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

					if ('nextSceneNode' in command) {
						commands.push(NextSceneCommand.load(command));
					}
					else {
						commands.push(Command.load(command));
					}
				}
				let sceneNode = new SceneNode(node.id, null, node.description, commands);
				nodes.push(sceneNode);
			}

			let prerequisites = new Array();
			if ("prerequisites" in sceneData) {
				for (let prereq of sceneData.prerequisites) {
					if ("key" in prereq && "value" in prereq) {
						prerequisites.push(prereq);
					}
				}
			}

			let scene = new Scene(sceneId, nodes, prerequisites);
			return scene;
		}
		catch(err) {
			throw new Error(`Unable to load scene: ${err}`);
		}
	}
}

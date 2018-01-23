class Scene extends GameObject{
	constructor(id) {
		super(id);

		this.nodes = null;
	}

	setSceneNodes(nodes) {
		this.nodes = nodes;
	}

	static loadScene(sceneData) {
		try {
			console.log(sceneData);
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

			let scene = new Scene(sceneId);
			scene.setSceneNodes(nodes);

			console.log(`Loaded scene ${sceneId}`);
			return scene;
		}
		catch(err) {
			throw new Error(`Unable to load scene: ${err}`);
		}
	}
}
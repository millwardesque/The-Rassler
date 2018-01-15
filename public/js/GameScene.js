class GameScene {
	constructor(id, description, commands) {
		this.id = id;
		this.description = description;
		this.commands = commands;
	}

	static loadScenes(scenesData) {
		try {
			let scenes = new Array();

			for (let sceneData of scenesData) {
				let commands = [];

				for (let i in sceneData.commands) {
					let command = sceneData.commands[i];
					command.id = "SceneCommand" + i;
					commands.push(Command.load(command));
				}
				let scene = new GameScene(sceneData.id, sceneData.description, commands);
				scenes.push(scene);
			}
			return scenes;
		}
		catch(err) {
			throw new Error(`Unable to load scenes: ${err}`);
		}
	}
}
class GameScene extends GameObject {
	constructor(id, description, commands) {
		super(id);

		this.isActiveScene = false;
		this.description = description;
		this.commands = commands;

		engine.eventDispatcher.addListener("Scene Change", this);
	}

	handleEvent(event) {
		if (event.id == "Scene Change") {
			if (event.data.id == this.id) {
				for (let command of this.commands) {
					command.isEnabled = true;
				}
				this.isActiveScene = true;
			}
			else if (this.isActiveScene) {
				for (let command of this.commands) {
					command.isEnabled = false;
				}
				this.isActiveScene = false;
			}	
		}		
	}

	static loadScenes(scenesData) {
		try {
			let scenes = new Array();

			for (let sceneData of scenesData) {
				let commands = [];

				for (let i in sceneData.commands) {
					let command = sceneData.commands[i];
					command.id = `Scene-${sceneData.id}-Command-${i}`;
					command.isEnabled = false;
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
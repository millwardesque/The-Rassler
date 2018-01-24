class SceneSelector extends GameObject {
	constructor(id) {
		super(id);

		engine.eventDispatcher.addListener("Select Next Scene", this);
	}

	handleEvent(event) {
		if (event.id == "Select Next Scene") {
			this.selectScene(event.data);
		}
	}

	selectScene(availableScenes) {
		let possibleScenes = [];

		// Produce a list of possible scenes to choose from
		for (let scene of availableScenes) {
			// Choose the first scene that isn't already active.
			if (scene != engine.activeScene) {
				possibleScenes.push(scene);
			}
		}
		
		if (possibleScenes.length > 0) {
			let index = Math.floor(Math.random() * possibleScenes.length);
			engine.eventDispatcher.dispatchEvent(new GameEvent('Set Scene', possibleScenes[index]));
		}
		else {
			throw new Error("Unable to select a scene. No scenes were provided.");
		}
	}
}
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

		if (availableScenes.length == 0) {
			throw new Error("Unable to select a scene. No scenes were provided.");
		}

		// Produce a list of possible scenes to choose from
		for (let scene of availableScenes) {
			this.log(`Checking scene ${scene.id} for validity`);
			if (scene == engine.activeScene) {
				continue;
			}

			// Make sure all prerequisites are present and satisfied.
			let arePrerequisitesSatisified = true;
			for (let prereq of scene.prerequisites) {
				this.log(`Checking prerequisite ${prereq.key}`);
				try {
					let value = engine.registry.findValue(prereq.key);
					if (value != prereq.value) {
						arePrerequisitesSatisified = false;
						break;
					}
				}
				catch (err) {
					this.log(err);
					arePrerequisitesSatisified = false;
					break;
				}
			}

			if (!arePrerequisitesSatisified) {
				continue;
			}

			this.log(`Including ${scene.id} in scene selection possibilities.`);
			possibleScenes.push(scene);
		}
		
		if (possibleScenes.length > 0) {
			let index = Math.floor(Math.random() * possibleScenes.length);
			engine.eventDispatcher.dispatchEvent(new GameEvent('Set Scene', possibleScenes[index]));
		}
		else {
			throw new Error("Unable to select a scene. No scenes meet all criteria.");
		}
	}
}
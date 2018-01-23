class SceneNode extends GameObject {
	constructor(id, description, commands) {
		super(id);

		this.isActiveSceneNode = false;
		this.description = description;
		this.commands = commands;

		engine.eventDispatcher.addListener("SceneNode Change", this);
	}

	handleEvent(event) {
		if (event.id == "SceneNode Change") {
			if (event.data.id == this.id) {
				for (let command of this.commands) {
					command.isEnabled = true;
				}
				this.isActiveSceneNode = true;
			}
			else if (this.isActiveSceneNode) {
				for (let command of this.commands) {
					command.isEnabled = false;
				}
				this.isActiveSceneNode = false;
			}	
		}		
	}
}
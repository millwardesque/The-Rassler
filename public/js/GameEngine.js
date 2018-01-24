class GameEngine extends GameObject {
	constructor(id, eventDispatcher) {
		super(id);

		this.eventDispatcher = new EventDispatcher();
		this.gameClock = new GameClock("Game Clock");
		this.activeScene = null;
		this.registry = new Registry();
		
		this.eventDispatcher.addListener("Registry Set", this);
		this.eventDispatcher.addListener("Registry Append", this);
		this.eventDispatcher.addListener("Set Scene", this);
	}

	handleEvent(event) {
		if (event.id == "Registry Set") {
			this.registry.set(event.data.key, event.data.value);
		}
		else if (event.id == "Registry Append") {
			this.registry.append(event.data.key, event.data.value);
		}
		else if (event.id == "Set Scene") {
			this.activeScene = event.data;
			this.log(`Set scene '${this.activeScene.id}'`);
			this.eventDispatcher.dispatchEvent(new GameEvent("Activate Scene Node", { sceneId: this.activeScene.id, nodeId: this.activeScene.nodes[0].id }));
		}
	}
}
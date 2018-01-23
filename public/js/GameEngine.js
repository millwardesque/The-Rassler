class GameEngine {
	constructor() {
		this.eventDispatcher = new EventDispatcher();
		this.gameClock = new GameClock("Game Clock");
		this.activeScene = null;
		this.sceneNodes = {};
		this.registry = new Registry();
		
		this.eventDispatcher.addListener("Registry Set", this);
		this.eventDispatcher.addListener("Registry Append", this);
	}

	setScene(scene) {
		this.activeScene = scene;	
		console.log(`[GameEngine] Set scene '${this.activeScene.id}'`);
		this.eventDispatcher.dispatchEvent(new GameEvent("Activate Scene Node", { sceneId: this.activeScene.id, nodeId: this.activeScene.nodes[0].id }));
	}

	handleEvent(event) {
		if (event.id == "Registry Set") {
			this.registry.set(event.data.key, event.data.value);
		}
		else if (event.id == "Registry Append") {
			this.registry.append(event.data.key, event.data.value);
		}
	}
}
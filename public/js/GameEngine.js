class GameEngine {
	constructor() {
		this.eventDispatcher = new EventDispatcher();
		this.gameClock = new GameClock("Game Clock");
		this.sceneNodes = {};
		this.registry = new Registry();

		this.eventDispatcher.addListener("Activate Scene Node", this);
		this.eventDispatcher.addListener("Registry Set", this);
		this.eventDispatcher.addListener("Registry Append", this);
	}

	setScene(scene) {
		for (let sceneNode of scene.nodes) {
			this.sceneNodes[sceneNode.id] = sceneNode;	
		}
		console.log(`[GameEngine] Set scene ${scene.id}`);
	}

	handleEvent(event) {
		if (event.id == "Activate Scene Node") {
			this.activateSceneNode(event.data);
		}
		else if (event.id == "Registry Set") {
			this.registry.set(event.data.key, event.data.value);
		}
		else if (event.id == "Registry Append") {
			this.registry.append(event.data.key, event.data.value);
		}
	}

	activateSceneNode(sceneNodeId) {
		if (this.sceneNodes.hasOwnProperty(sceneNodeId)) {
			let sceneNode = this.sceneNodes[sceneNodeId];
			
			this.eventDispatcher.dispatchEvent(new GameEvent("SceneNode Change", sceneNode));
		}
		else {
			throw new Error(`SceneNode '${sceneNodeId}' wasn't found`);
		}
	}
}
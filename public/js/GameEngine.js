class GameEngine {
	constructor() {
		this.eventDispatcher = new EventDispatcher();
		this.gameClock = new GameClock("Game Clock");
		this.scenes = {};
		this.registry = new Registry();

		this.eventDispatcher.addListener("Load Scene", this);
		this.eventDispatcher.addListener("Registry Set", this);
		this.eventDispatcher.addListener("Registry Append", this);
	}

	addScene(scene) {
		this.scenes[scene.id] = scene;
		console.log(`[GameEngine] Added scene ${scene.id}`);
	}

	handleEvent(event) {
		if (event.id == "Load Scene") {
			this.loadScene(event.data);
		}
		else if (event.id == "Registry Set") {
			this.registry.set(event.data.key, event.data.value);
		}
		else if (event.id == "Registry Append") {
			this.registry.append(event.data.key, event.data.value);
		}
	}

	loadScene(sceneId) {
		if (this.scenes.hasOwnProperty(sceneId)) {
			let scene = this.scenes[sceneId];
			
			this.eventDispatcher.dispatchEvent(new GameEvent("Scene Change", scene));
		}
		else {
			throw new Error(`Scene '${sceneId}' wasn't found`);
		}
	}
}
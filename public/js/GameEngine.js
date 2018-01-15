class GameEngine {
	constructor() {
		this.eventDispatcher = new EventDispatcher();
		this.gameClock = new GameClock();
		this.scenes = {}

		this.eventDispatcher.addListener("Load Scene", this);
	}

	addScene(scene) {
		this.scenes[scene.id] = scene;
		console.log(`[GameEngine] Added scene ${scene.id}`);
	}

	handleEvent(event) {
		if (event.id == "Load Scene") {
			this.loadScene(event.data);
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
class GameEngine {
	constructor() {
		this.eventDispatcher = new EventDispatcher();
		this.gameClock = new GameClock();
		this.scenes = {}
	}

	addScene(scene) {
		this.scenes[scene.id] = scene;
	}

	loadScene(sceneId) {
		if (this.scenes.hasOwnProperty(sceneId)) {
			let scene = this.scenes[sceneId];
			
			this.eventDispatcher.dispatchEvent(new GameEvent("Scene Change", scene));
		}
		else {
			throw new Exception(`Scene '${sceneId}' wasn't found`);
		}
	}
}
class GameEngine extends GameObject {
	constructor(id) {
		super(id);
	}

	initialize() {
		this.eventDispatcher = new EventDispatcher();
		this.registry = new Registry();
		this.sceneSelector = new SceneSelector("Scene Selector");
		this.activeScene = null;
		
		this.eventDispatcher.addListener(GameEvents.RegistrySet, this);
		this.eventDispatcher.addListener(GameEvents.RegistryAppend, this);
		this.eventDispatcher.addListener(GameEvents.SetScene, this);
		this.eventDispatcher.addListener(GameEvents.LoadGameState, this);
	}

	handleEvent(event) {
		if (event.id == GameEvents.RegistrySet) {
			this.registry.set(event.data.key, event.data.value);
		}
		else if (event.id == GameEvents.RegistryAppend) {
			this.registry.append(event.data.key, event.data.value);
		}
		else if (event.id == GameEvents.SetScene) {
			this.activeScene = event.data;
			this.log(`Set scene '${this.activeScene.id}'`);
			this.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.ActivateSceneNode, { sceneId: this.activeScene.id, nodeId: this.activeScene.nodes[0].id }));
		}
		else if (event.id == GameEvents.LoadGameState) {
			let newGameState = event.data;

			this.log(`Loading game state ${newGameState}`);
			if (newGameState == 'ingame') {
				GameStates.loadInGameState(this);
			}
			else if (newGameState == 'main menu') {
				GameStates.loadMainMenu(this);
			}
			else {
				throw new Error(`Unable to load game state ${newGameState}: No matching state was found.`);
			}
		}
	}
}
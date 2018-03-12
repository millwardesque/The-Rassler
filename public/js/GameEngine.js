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
	}
}
let engine = null;

window.onload = async function() {
	engine = new GameEngine("Game Engine");
	engine.initialize();
	engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.LoadGameState, 'scene editor'))

	/**
	  TODO:
	  Editor engine:	    
		Scene-editing form
		Extract scene-selector from engine
		Load from local storage
		Integrate back into index.js
	*/
}
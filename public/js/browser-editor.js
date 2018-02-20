let engine = null;

window.onload = async function() {
	engine = new GameEngine("Game Engine");
	engine.initialize();
	engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.LoadGameState, 'scene editor'))

	/**
	  TODO:

	  Milestone: Load / Save objects
	   	Load from local storage

	  Editor engine:	    
		Scene-editing form
		Extract scene-selector from engine
		Integrate back into index.js
	*/
}
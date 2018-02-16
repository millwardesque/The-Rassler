let engine = null;

window.onload = async function() {
	engine = new GameEngine("Game Engine");
	engine.initialize();
	engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.LoadGameState, 'scene editor'))

	/**
	  TODO:

	  Milestone: Load / Save JSON
		Build engine interaction scaffolding
		Write JSON to local storage
	   	Dump JSON to console
	   	Load from local storage
	   	Load from file asset

	  Editor engine:	    
		Scene-editing form
		Extract scene-selector from engine
		Integrate back into index.js
	*/
}
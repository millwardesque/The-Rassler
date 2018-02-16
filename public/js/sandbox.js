let engine = null;

window.onload = async function() {
	engine = new GameEngine("Game Engine");
	engine.initialize();
	engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.LoadGameState, 'main menu'))
	
	/**
	  TODO:

	  Milestone: Scene editor
		Write JSON to cookie
	   	Dump JSON to console
	   	Load from cookie
		Editing form 
	   	Load from file asset  

	  Milestone: Waiting for editor: Simulate day one
	   Add bedtime scene
	   Add mid-day scenes

	  Engine:
	   Game calendar
	   Save progress
	   Scene description markup
	   Scene editor
	   Use better JS file loader (Webpack, etc.)
	   Be smarter about enabled / disabled game objects.
	   Prevent unregistered event from being dispatched.
	   Different renderer by game state
	   Find more elegant place to catch the LoadGameState event
	   Detect error when no valid scenes are available

	  Dynamic story extension:
	   Add prerequisite support to scenenode commands
	   Reusable snippets of text for similar scene segments.
	   Tweak command text based on status and previous interactions.
	   Determine commands on scene load instead of fixed list.
	   Systems for plot
	   Responses / commands based on relationships and status
	   Random next-node command outcomes (e.g. After choosing a command, 50% of X happening, 30% of Y happening, 20% of Z happening)
	
	  If needed:
	   Game states?
	   Game loop?
	   Player?
	   Inventory?
	   Better logger?

	  Content:
	   Scenes
	   Territories
	   Other wrestlers
	   Stories
	   Matches
	   Locations
	   Venues
	   Bookers
	*/
}
let engine = null;

window.onload = async function() {
	engine = new GameEngine("Game Engine");
	engine.initialize();
	
	engine.eventDispatcher.addListener(GameEvents.LoadGameState, {
		id: "__main__",
		handleEvent: (event) => {
			engine.log("Called");
			if (event.id == GameEvents.LoadGameState) {
				let newGameState = event.data;

				engine.log(`Loading game state ${newGameState}`);
				if (newGameState == 'ingame') {
					GameStates.loadInGameState(engine);
				}
				else if (newGameState == 'main menu') {
					GameStates.loadMainMenu(engine);
				}
				else if (newGameState == 'scene editor') {
					GameStates.loadSceneEditor(engine);
				}
				else if (newGameState == 'commander') {
					GameStates.loadCommander(engine);
				}
				else {
					throw new Error(`Unable to load game state '${newGameState}': No matching state was found.`);
				}
			}
		}
	});

	engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.LoadGameState, 'main menu'))

	/**
	  TODO:
	  Milestone: Scene editor

	  Milestone: Waiting for editor: Simulate day one
	   Add bedtime scene
	   Add mid-day scenes

	  Engine:
	   Disabled commands (e.g. for items you can't afford)
	   Move nextSceneNode out of command class and into onExecute array
	   Pass line and file to log class for clearer log messages in console.
	   Tags for object causes and effects (e.g. 'causes: fire', 'causes: kick', 'affected by: fire')
	   Parse custom commands
	   All event handles should return promises.
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

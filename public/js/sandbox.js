let engine = null;

window.onload = async function() {
	// Set up game engine
	engine = new GameEngine("Game Engine");
	engine.gameClock = new GameClock("Game Clock");
	engine.sceneSelector = new SceneSelector("Scene Selector");

	// Set up UI
	let clockUI = new GameClockUI("Clock UI", document.querySelector('#gameClock-container'));
	let commandsUI = new CommandsUI("Commands UI", document.querySelector('#commands'));
	let descriptionUI = new DescriptionUI("Description UI", document.querySelector('#description'));

	// Load the game data.
	let gameData;
	try {
		gameData = await loadGameData();

		engine.gameData = gameData;
	}
	catch(err) {
		console.log(`Error loading game data: ${err}`);
		throw err;
	}

	engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.RegistrySet, { key: 'currentTerritory', value: engine.gameData.territories[0] }));
	engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.RegistrySet, { key: 'currentAntagonist', value: engine.gameData.people[0] }));
	engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.RegistrySet, { key: 'currentBooker', value: engine.gameData.people[2] }));

	// Load the starting scene.
	engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.SelectNextScene, engine.gameData.scenes));
	engine.gameClock.setTime(0, 0);

	/**
	  TODO:
	  Milestone: Simulate day one
	   Add bedtime scene
	   Add mid-day scenes
	   Handle no valid scenes left

	  Engine:
	   Game calendar
	   Save progress
	   Scene description markup
	   Scene editor
	   Use better JS file loader (Webpack, etc.)
	   Be smarter about enabled / disabled game objects.
	   Hardcoded list of events

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

function loadGameData() {
	return new Promise(async function (resolve, reject) {
		try {
			let gameData = {};

			// Load the people
			gameData.people = [];
			let response = await webUtils.getRequest('/gamedata/people.json');
			response = JSON.parse(response);
			for (let row of response) {
				let person = new Person(row.first, row.last);
				gameData.people.push(person);
			}

			// Load the territories
			gameData.territories = [];
			response = await webUtils.getRequest('/gamedata/territories.json');
			response = JSON.parse(response);
			for (let row of response) {
				let territory = new Territory(row.name, row.name, row.rosterCapacity);
				gameData.territories.push(territory);
			}

			// Load the test story
			gameData.scenes = [];
			response = await webUtils.getRequest('/gamedata/test-story.json');
			response = JSON.parse(response);

			if (response.hasOwnProperty('scenes')) {
				gameData.scenes = [];
				for (let scene of response.scenes) {
					gameData.scenes.push(Scene.load(scene));
				}
			}

			resolve(gameData);
		}
		catch(err) {
			reject(err);
		}
	});
}
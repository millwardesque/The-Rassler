let engine = null;

window.onload = async function() {
	// Set up game engine
	engine = new GameEngine();

	// Set up UI
	let clockUI = new GameClockUI("Clock UI", document.querySelector('#gameClock-container'));
	let commandsUI = new CommandsUI("Commands UI", document.querySelector('#commands'));
	let descriptionUI = new DescriptionUI("Description UI", document.querySelector('#description'));

	// Load the game data.
	let gameData;
	try {
		gameData = await loadGameData();

		for (let scene of gameData.scenes) {
			engine.addScene(scene);
		}

		engine.gameData = gameData;
	}
	catch(err) {
		console.log(`Error loading game data: ${err}`);
		throw err;
	}

	engine.eventDispatcher.dispatchEvent(new GameEvent('Registry Set', { key: 'currentTerritory', value: engine.gameData.territories[0] }));
	engine.eventDispatcher.dispatchEvent(new GameEvent('Registry Set', { key: 'currentAntagonist', value: engine.gameData.people[0] }));
	engine.eventDispatcher.dispatchEvent(new GameEvent('Registry Set', { key: 'currentBooker', value: engine.gameData.people[2] }));

	// Load the starting scene.
	engine.eventDispatcher.dispatchEvent(new GameEvent("Load Scene", "t1"));
	engine.gameClock.setTime(0, 0);

	/**
	  TODO:
	  Determine next milestone.

	  Engine:
	   Redefine Scene to be a collection of speech interactions.
	   Stat-changing events
	   Game calendar
	   Save progress
	   Scene description markup
	   Scene editor
	   Use better JS file loader (Webpack, etc.)

	  Dynamic story extension:
	   Reusable snippets of text for similar scene segments.
	   Tweak command text based on status and previous interactions.
	   Determine commands on scene load instead of fixed list.
	   Systems for plot
	   Responses / commands based on relationships and status
	
	  If needed:
	   Game states?
	   Game loop?
	   Player?
	   Inventory?

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
				gameData.scenes = GameScene.loadScenes(response.scenes);
			}

			resolve(gameData);
		}
		catch(err) {
			reject(err);
		}
	});
}
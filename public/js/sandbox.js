let engine = null;

window.onload = async function() {
	// Set up game engine
	engine = new GameEngine();

	// Set up UI
	let clockUI = new GameClockUI(document.querySelector('#gameClock-container'));
	let commandsUI = new CommandsUI(document.querySelector('#commands'));
	let descriptionUI = new DescriptionUI(document.querySelector('#description'));

	// Load the territories
	let gameData;
	try {
		gameData = await loadGameData();

		for (let scene of gameData.scenes) {
			engine.addScene(scene);
		}
	}
	catch(err) {
		throw new Error(`Error loading game data: ${err}`);
	}

	// Load the starting scene.
	engine.eventDispatcher.dispatchEvent(new GameEvent("Load Scene", "t1"));

	engine.gameClock.setTime(0, 0);

	/**
	  TODO:
	  [Milestone] Write a test locker room interraction with another wrestler
	   Rich HTML markup
	   Write content

	  Engine:
	   Game calendar
	   Documentation
	   Placeholders in scene text.

	  Dynamic story extension:
	   Determine commands on scene load instead of fixed list.
	   Systems for plot
	
	  If needed:
	   Game states?
	   Game loop?
	   Player?
	   Inventory?
	   Save place

	  Content:
	   Scenes
	   Territories
	   Other wrestlers
	   Stories
	   Matches
	   Bookers
	*/
}

function loadGameData() {
	return new Promise(async function (resolve, reject) {
		try {
			let gameData = {};

			// Load the territories
			gameData.territories = [];
			let response = await webUtils.getRequest('./js/territories.json');
			response = JSON.parse(response);
			for (let row of response) {
				let territory = new Territory(row.name, row.rosterCapacity);
				gameData.territories.push(territory);
			}

			// Load the test story
			gameData.scenes = [];
			response = await webUtils.getRequest('./js/test-story.json');
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
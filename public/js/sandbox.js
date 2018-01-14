let engine = null;
let commandsUI = null;
let clockUI = null;

window.onload = async function() {
	// Set up game engine
	engine = new GameEngine();

	// Set up UI
	clockUI = new GameClockUI(document.querySelector('#gameClock-container'));
	commandsUI = new CommandsUI(document.querySelector('#commands'));
	descriptionUI = new DescriptionUI(document.querySelector('#description'));
	

	// Set up sandbox stuff
	engine.gameClock.setTime(0, 0);

	let commands = [];
	commands.push(new SleepCommand('sleep', 'Sleep', 30))
	commands.push(new SleepCommand('dream', 'Dream', 90));	

	let testScene = new GameScene("test-1", "You're alone in your bedroom", commands);
	engine.addScene(testScene);

	engine.loadScene("test-1");

	// Load the territories
	let gameData;
	try {
		gameData = await loadGameData();
	}
	catch(err) {
		throw new Error(`Error loading game data: ${err}`);
	}

	setInterval(() => {
		engine.gameClock.addTime(0, 5);
	}, 1000);

	/**
	  TODO:
	  Engine:
	   Game states
	   Game states respond to events
	   Game calendar
	   Game loop?
	   Player
	   Inventory
	   Documentation
	   PlotMaker
	   GetNewCommands
	   Load commands, scenes from JSON.
	   Next scene?
	
	  Presentation (rough):
	   

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

			resolve(gameData);
		}
		catch(err) {
			reject(err);
		}
	});
}
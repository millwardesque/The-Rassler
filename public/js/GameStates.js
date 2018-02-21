class GameStates {
	static loadInGameState(engine) {
		return new Promise(async function(resolve, reject) {
			try {
				// Set up game engine
				engine.initialize();

				// Set up state-specific stuff.
				let gameClock = new GameClock("Game Clock");
				engine.registry.set('clock', gameClock);

				// Set up UI
				let clockUI = new GameClockUI("Clock UI", document.querySelector('#gameClock-container'));
				let commandsUI = new CommandsUI("Commands UI", document.querySelector('#commands'));
				let descriptionUI = new DescriptionUI("Description UI", document.querySelector('#description'));

				// Load the game data.
				let gameData;
				try {
					gameData = await GameStates._loadGameData();

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
				gameClock.setTime(0, 0);

				resolve();
			}
			catch(err) {
				reject(err);
			}
		});
	}

	static loadMainMenu(engine) {
		return new Promise(async function(resolve, reject) {
			try {
				// Set up game engine
				engine.initialize();

				// Set up state-specific stuff.

				// Set up UI.
				let commandsUI = new CommandsUI("Commands UI", document.querySelector('#commands'));
				let descriptionUI = new DescriptionUI("Description UI", document.querySelector('#description'));

				// Load the menu data.
				let gameData;
				try {
					gameData = await GameStates._loadMainMenuData();
					engine.gameData = gameData;
				}
				catch(err) {
					console.log(`Error loading game data: ${err}`);
					throw err;
				}

				// Load the starting scene.
				engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.SelectNextScene, engine.gameData.scenes));
				resolve();
			}
			catch(err) {
				reject(err);
			}
		});
	}

	static loadSceneEditor(engine) {
		return new Promise(async function(resolve, reject) {
			try {
				// Set up game engine
				engine.initialize();

				// Set up UI
				let fileLoaderEditorUI = new FileLoaderEditorUI("File Loader Editor UI", document.querySelector('#file-loader'));
				let sceneNodeEditorUI = new SceneNodeEditorUI('Scene Node Editor UI', document.querySelector('#sceneNodes'));

				resolve();
			}
			catch(err) {
				reject(err);
			}
		});
	}

	static _loadMainMenuData() {
		return new Promise(async function (resolve, reject) {
			try {
				let gameData = {};
				
				// Load the main menu
				gameData.scenes = [];
				let response = await Storage.getStorageEngine().getItem('main-menu.json');
				if ('scenes' in response) {
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

	static _loadGameData() {
		return new Promise(async function (resolve, reject) {
			try {
				let gameData = {};

				// Load the people
				gameData.people = [];
				let response = await Storage.getStorageEngine().getItem('people.json');
				for (let row of response) {
					let person = new Person(row.first, row.last);
					gameData.people.push(person);
				}

				// Load the territories
				gameData.territories = [];
				response = await Storage.getStorageEngine().getItem('territories.json');
				for (let row of response) {
					let territory = new Territory(row.name, row.name, row.rosterCapacity);
					gameData.territories.push(territory);
				}

				// Load the test story
				gameData.scenes = [];
				response = await Storage.getStorageEngine().getItem('test-story.json');
				if ('scenes' in response) {
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
}
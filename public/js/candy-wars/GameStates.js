class GameStates {
    static loadInGameState(engine) {
        return new Promise(async function(resolve, reject) {
            try {
                // Set up state-specific stuff.
                let gameClock = new GameClock("Game Clock");
                engine.registry.set('clock', gameClock);

                let commandParser = new CommandParser("Command Parser");
                engine.registry.set('commandParser', commandParser);

                let inventory = new Inventory("Player inventory");
                engine.registry.set('inventory', inventory);

                // Set up UI
                let clockUI = new GameClockUI("Clock UI", document.querySelector('#gameClock-container'));
                let commandsUI = new CommandsUI("Commands UI", document.querySelector('#commands'));
                let descriptionUI = new DescriptionUI("Description UI", document.querySelector('#description'));
                let inventoryUI = new InventoryUI("Inventory UI", document.querySelector('#inventory'));
                let wealthUI = new WealthUI("Wealth UI", document.querySelector('#wealth-container .wealth'));

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

                // Set up starting data
                for (let location of engine.gameData.locations) {
                    engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.RegistryAppend, { key: "locations", value: location }));
                }
                engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.ChangeLocation, { location: engine.gameData.startingLocation }));

                let wealth = new Wealth('player-wealth');
                engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.RegistrySet, { key: "wealth", value: wealth }));
                wealth.set(gameData.startingWealth);

                engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.OnInventoryChange, null));

                gameClock.setTime(engine.gameData.dayStartTime, 0);

                resolve();
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

                // Load the game file.
                let response = await Storage.getStorageEngine().getItem('candy-wars.json');

                // Order of these is important as some types are dependent on others.
                if ('merchandise' in response) {
                    gameData.merchandise = [];
                    for (let row of response.merchandise) {
                        let merchandise = new Merchandise(row.name, row.name, row.baseCost, row.unit);
                        gameData.merchandise.push(merchandise);
                    }
                }
                else {
                    throw new Exception("No merchandise was found in the game data.");
                }

                // Depends on merchandise being loaded.
                if ('vendors' in response) {
                    gameData.vendors = [];
                    for (let row of response.vendors) {
                        let vendor = new Vendor(row.id, row.name);

                        if (row['merchandise']) {
                            for (let itemName of row['merchandise']) {
                                for (let merchandise of gameData.merchandise) {
                                    if (itemName == merchandise.name) {
                                        vendor.addMerchandise(merchandise);
                                    }
                                }
                            }
                        }

                        gameData.vendors.push(vendor);
                    }
                }
                else {
                    throw new Exception("No vendors were found in the game data.");
                }

                // Load locations after merchandise because each location depends on the merch being instantiated already.
                if ('locations' in response) {
                    gameData.locations = [];
                    for (let row of response.locations) {
                        let location = new Location(row.name, row.name, row.description, row.vendor);

                        if (row['vendors']) {
                            for (let vendorId of row['vendors']) {
                                for (let vendor of gameData.vendors) {
                                    if (vendorId == vendor.id) {
                                        location.addOccupant(vendor);
                                    }
                                }
                            }
                        }

                        gameData.locations.push(location);
                    }
                }
                else {
                    throw new Exception("No locations were found in the game data.");
                }

                if ('startingLocation' in response) {
                    let startingLocation = null;
                    for (let row of gameData.locations) {
                        if (row.name == response['startingLocation']) {
                            startingLocation = row;
                            break;
                        }
                    }

                    gameData.startingLocation = startingLocation;
                }
                else {
                    throw new Exception("No starting location was found in the game data.");
                }

                if ('startingWealth' in response) {
                    gameData.startingWealth = response['startingWealth'];
                }
                else {
                    throw new Exception("No starting wealth was found in the game data.");
                }

                if ('dayStartTime' in response) {
                    gameData.dayStartTime = response['dayStartTime'];
                }
                else {
                    throw new Exception("No day-start time was found in the game data.");
                }

                resolve(gameData);
            }
            catch(err) {
                reject(err);
            }
        });
    }
}
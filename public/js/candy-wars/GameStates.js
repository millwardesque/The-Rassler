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
                let gameUI = new GameUI("Game UI", document.querySelector('#game-canvas'));
                let commandsUI = new CommandsUI("Commands UI", document.querySelector('#commands'));
                let wealthUI = new WealthUI("Wealth UI", document.querySelector('#wealth-container'));
                let locationUI = new GameLocationUI("Location", document.querySelector('#location-container'));

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
                engine.registry.set("scenes", engine.gameData.scenes);

                for (let location of engine.gameData.locations) {
                    engine.registry.append("locations", location);
                }


                let wealth = new Wealth('player-wealth');
                engine.registry.set("wealth", wealth);
                wealth.set(gameData.startingWealth);

                engine.registry.set('end-hour', engine.gameData.endHour)

                engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.ChangeLocation, { location: engine.gameData.startingLocation }));
                engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.OnInventoryChange, inventory));
                gameClock.setTime(engine.gameData.startDay, engine.gameData.startHour, engine.gameData.startMinute);
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

                if ('lenders' in response) {
                    gameData.lenders = [];
                    for (let row of response.lenders) {
                        let startingFunds = 0;
                        if (row['funds']) {
                            startingFunds = row['funds']
                        }
                        let lender = new MoneyLender(row.id, row.name, startingFunds);
                        gameData.lenders.push(lender);
                    }
                }

                // Load locations after merchandise because each location depends on the merch being instantiated already.
                if ('locations' in response) {
                    gameData.locations = [];
                    for (let row of response.locations) {
                        let location = null;
                        if ('type' in row && row['type'] == 'Home') {
                            location = new Home(row.name, row.name, row.description);
                        }
                        else {
                            location = new GameLocation(row.name, row.name, row.description);
                        }


                        if (row['vendors']) {
                            for (let vendorId of row['vendors']) {
                                for (let vendor of gameData.vendors) {
                                    if (vendorId == vendor.id) {
                                        location.addOccupant(vendor);
                                    }
                                }
                            }
                        }

                        if (row['lenders']) {
                            for (let lenderId of row['lenders']) {
                                for (let lender of gameData.lenders) {
                                    if (lenderId == lender.id) {
                                        location.addOccupant(lender);
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

                if ('scenes' in response) {
                    gameData.scenes = [];
                    for (let scene of response.scenes) {
                        gameData.scenes.push(Scene.load(scene));
                    }
                }

                if ('startingWealth' in response) {
                    gameData.startingWealth = response['startingWealth'];
                }
                else {
                    throw new Exception("No starting wealth was found in the game data.");
                }

                gameData.startDay = 0
                if ('startDay' in response) {
                    gameData.startDay = response['startDay'];
                }

                gameData.startHour = 0
                if ('startHour' in response) {
                    gameData.startHour = response['startHour'];
                }

                gameData.startMinute = 0
                if ('startMinute' in response) {
                    gameData.startMinute = response['startMinute'];
                }

                gameData.endHour = null;
                if ('endHour' in response) {
                    gameData.endHour = response['endHour'];
                }

                resolve(gameData);
            }
            catch(err) {
                reject(err);
            }
        });
    }
}

let game = null;
let engine = null;

window.onload = async function() {
    game = new CandyWars();
    game.start();

    /**
    TODO:
    Milestone: UI / Playability improvement
     Drop-down to choose location
     Add background photos for locations

    Prices change daily
    Player can only sell candy at school at fixed times
    Player can wait at a location for an hour
    Adjust travel times to take less than an hour

    Time-of-day description (e.g. "Parents have just left for the day"
    Add price spikes and drops
    Package engine source into sub-folder

    Generate random travel time between locations on start
    Create CommandUI classes to allow custom commands to handle their own rendering / retrieval
    Move buy/sell/borrow/repay event handling into appropriate classes

    Separate description into separate updateable parts (dialog, status, location description)
    Allow disabling (but showing) buy/sell buttons when not available

    Ideas:
    Buy territory?
    Bullies who steal money and/or inventory
    Penalty for skipping school hours
    Buy bike to go to other places
    Police search for you if out after dark
    */
}

class CandyWars {
    constructor() {
        this.engine = new GameEngine("Candy Wars Game Engine");

        // Set the global 'engine' variable.
        // @TODO Make this less ugly throughout the codebase.
        engine = this.engine;
    }

    start() {
        this.engine.initialize();
        this.engine.eventDispatcher.addListener(GameEvents.LoadGameState, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.ChangeLocation, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.BuyMerchandise, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.SellMerchandise, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.RepayDebt, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.BorrowFunds, this);
        this.engine.eventDispatcher.addListener(GameEvents.OnGameTimeChange, this);
        this.engine.eventDispatcher.addListener(GameEvents.OnSceneEnd, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.RestartGame, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.Sleep, this);

        this.activeCommands = [];
        this.hasSeenEndOfDayMessage = false;

        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.LoadGameState, 'ingame'))
    }

    handleEvent(event) {
        if (event.id == GameEvents.LoadGameState) {
            this.loadGameState(event.data);
        }
        else if (event.id == CustomGameEvents.ChangeLocation) {
            this.changeLocation(event.data.location);
        }
        else if (event.id == CustomGameEvents.BuyMerchandise) {
            this.buyMerchandise(event.data);
        }
        else if (event.id == CustomGameEvents.SellMerchandise) {
            this.sellMerchandise(event.data);
        }
        else if (event.id == CustomGameEvents.RepayDebt) {
            this.repayDebt(event.data);
        }
        else if (event.id == CustomGameEvents.BorrowFunds) {
            this.borrowFunds(event.data);
        }
        else if (event.id == GameEvents.OnGameTimeChange) {
            this.onGameTimeChange(event.data);
        }
        else if (event.id == GameEvents.OnSceneEnd) {
            this.onSceneEnd(event.data);
        }
        else if (event.id == CustomGameEvents.Sleep) {
            this.sleep(event.data);
        }
        else if (event.id == CustomGameEvents.RestartGame) {
            this.restartGame();
        }
    }

    loadGameState(newGameState) {
        this.engine.log(`Loading game state ${newGameState}`);
        if (newGameState == 'ingame') {
            GameStates.loadInGameState(this.engine);
        }
        else {
            throw new Error(`Unable to load game state '${newGameState}': No matching state was found.`);
        }
    }

    changeLocation(newLocation) {
        let oldLocation = this.engine.registry.findValue('current-location');
        let clock = this.engine.registry.findValue('clock');

        newLocation.getOccupants().forEach(occupant => {
            if (typeof(occupant.generatePriceMods) === "function") {
                occupant.generatePriceMods();
            }
        });

        // Set the new location
        this.engine.registry.set("current-location", newLocation);

        // Update the description
        let newDescription = `${newLocation.getFullDescription()}`;
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));

        this.rebuildCommands();

        // Process travel time after everything else because the time change may introduce a new scene.
        if (oldLocation) {
            let travelTime = oldLocation.travelTime(newLocation);
            clock.addTime(0, travelTime, 0);
        }

        this.engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.OnLocationEnter, newLocation));
    }

    buyMerchandise(purchaseOrder) {
        let totalCost = purchaseOrder.unitPrice * purchaseOrder.quantity;

        let wealth = this.engine.registry.findValue('wealth');
        if (wealth == null) {
            throw new Error("Unable to locate player wealth in registry");
        }

        let location = this.engine.registry.findValue('current-location');
        if (wealth.wealth >= totalCost) {
            let inventory = this.engine.registry.findValue('inventory');
            inventory.add(purchaseOrder.itemName, purchaseOrder.quantity);

            let newDescription = `You just bought ${purchaseOrder.quantity} ${purchaseOrder.itemName} for \$${totalCost.toFixed(2)}. Enjoy!`;
            newDescription += `\n\n${location.getFullDescription()}`;
            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));
            wealth.change(-totalCost);
        }
        else {
            let newDescription = `You don't have enough money to buy that`;
            newDescription += `\n\n${location.getFullDescription()}`;
            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));
        }

        this.rebuildCommands();
    }

    sellMerchandise(saleOrder) {
        let inventory = this.engine.registry.findValue('inventory');
        let wealth = this.engine.registry.findValue('wealth');
        let location = this.engine.registry.findValue('current-location');
        let totalProfit = saleOrder.unitPrice * saleOrder.quantity;

        if (inventory.get(saleOrder.itemName) >= saleOrder.quantity) {
            inventory.add(saleOrder.itemName, -saleOrder.quantity);

            let newDescription = `You just sold ${saleOrder.quantity} ${saleOrder.itemName} for \$${totalProfit.toFixed(2)}.`;
            newDescription += `\n\n${location.getFullDescription()}`;
            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));
            wealth.change(totalProfit);
        }
        else {
            let newDescription = `You don't have enough ${saleOrder.itemName} to sell.`;
            newDescription += `\n\n${location.getFullDescription()}`;
            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));
        }

        this.rebuildCommands();
    }

    repayDebt(repayOrder) {
        let location = this.engine.registry.findValue('current-location');
        let wealth = this.engine.registry.findValue('wealth');
        let amountPaid = repayOrder.lender.repayDebt(repayOrder.amount);
        wealth.change(-amountPaid);
        wealth.changeBorrowed(-amountPaid);

        let newDescription = `You just repaid \$${amountPaid.toFixed(2)}.`;
        newDescription += `\n\n${location.getFullDescription()}`;
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));

        this.rebuildCommands();
    }

    borrowFunds(borrowOrder) {
        let location = this.engine.registry.findValue('current-location');
        let wealth = this.engine.registry.findValue('wealth');

        let amountBorrowed = borrowOrder.lender.borrowFunds(borrowOrder.amount);
        wealth.change(amountBorrowed);
        wealth.changeBorrowed(amountBorrowed);

        let newDescription = `You just borrowed \$${amountBorrowed.toFixed(2)}.`;
        newDescription += `\n\n${location.getFullDescription()}`;
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));

        this.rebuildCommands();
    }

    onGameTimeChange(timeChange) {
        let endHour = this.engine.registry.findValue('end-hour');

        if (timeChange.current.hour > endHour) {
            let debtOwed = 0;
            this.engine.registry.findValue('locations').forEach((location) => {
                location.getOccupants().forEach((occupant) => {
                    if (occupant instanceof MoneyLender) {
                        debtOwed += occupant.debtOwed;
                    }
                });
            });

            if (debtOwed) {
                this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.ActivateScene, "game-over"));
            }
        }
        else if (timeChange.current.hour >= endHour && !this.hasSeenEndOfDayMessage) {
            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.ActivateScene, "end-of-day"));
            this.hasSeenEndOfDayMessage = true;
        }

        if (timeChange.current.day != timeChange.oldDay) {
            this.hasSeenEndOfDayMessage = false;
        }
    }

    onSceneEnd() {
        let location = this.engine.registry.findValue('current-location');

        // Update the description
        let newDescription = `${location.getFullDescription()}`;
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));

        this.rebuildCommands();
    }

    sleep(sleepDuration) {
        let location = this.engine.registry.findValue('current-location');
        let clock = this.engine.registry.findValue('clock');
        clock.addTime(sleepDuration.days, sleepDuration.hours, sleepDuration.minutes);

        let newDescription = `You wake up after a good sleep and feel mighty rested`;
        newDescription += `\n\n${location.getFullDescription()}`;
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));

        this.rebuildCommands();
    }

    restartGame() {
        this.start();
    }

    rebuildCommands() {
        let inventory = this.engine.registry.findValue('inventory');
        let currentLocation = this.engine.registry.findValue('current-location');

        // Clean up old commands
        for (let command of this.activeCommands) {
            this.engine.eventDispatcher.removeListener(command);
        }

        let commands = [];

        // Get commands of location occupants.
        if (currentLocation.occupants.length) {
            for (let occupant of currentLocation.occupants) {
                commands = commands.concat(occupant.getCommands());
            }
        }

        // Get commands from location itself
        commands = commands.concat(currentLocation.getCommands());

        // Generate location-move commands
        this.engine.registry.findValue('locations').forEach((otherLocation) => {
            if (otherLocation.name != currentLocation.name) {
                let command = new Command(`travel-${otherLocation.name}`, `Travel to ${otherLocation.name} (${currentLocation.travelTime(otherLocation)}h)`, null);
                command.onExecute.push({ key: CustomGameEvents.ChangeLocation, value: { location: otherLocation }});
                commands.push(command);
            }
        });

        // Set the new commands
        this.activeCommands = commands;
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateCommandsUI, { commands: this.activeCommands }));
    }
}

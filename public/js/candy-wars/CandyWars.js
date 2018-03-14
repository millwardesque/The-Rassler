let game = null;
let engine = null;

window.onload = async function() {
    game = new CandyWars();
    game.start();

    /**
    TODO:
    Milestone: Make a game out of everthing
        Daily cycle and day-count in stats
        Day ends at 6pm

        Player has to return money by 6pm or game over.
        Restart on game over

        Player can only sell candy at school at fixed times
        Player can wait at a location for an hour
        Adjust travel times to take less than an hour

        Move buy/sell/borrow/repay event handling into appropriate classes

    Time-of-day description (e.g. "Parents have just laft for the day"
    Merge buy / sell commands
    Separate description into separate updateable parts (dialog, status, location description)
    Add price spikes and drops
    Package engine source into sub-folder
    Drop-down to choose location
    Generate random travel time between locations on start
    Create CommandUI classes to allow custom commands to handle their own rendering / retrieval

    Ideas:
    Buy territory?
    Bullies who steal money and/or inventory
    Penalty for skipping school hours
    */
}

class CandyWars {
    constructor() {
        this.engine = new GameEngine("Candy Wars Game Engine");

        // Set the global 'engine' variable.
        // @TODO Make this less ugly throughout the codebase.
        engine = this.engine;

        this.engine.initialize();
        this.engine.eventDispatcher.addListener(GameEvents.LoadGameState, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.ChangeLocation, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.BuyMerchandise, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.SellMerchandise, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.RepayDebt, this);
        this.engine.eventDispatcher.addListener(CustomGameEvents.BorrowFunds, this);

        this.activeCommands = [];
    }

    start() {
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

        // Process travel time.
        if (oldLocation) {
            let travelTime = oldLocation.travelTime(newLocation);
            clock.addTime(0, travelTime, 0);
        }

        newLocation.getOccupants().forEach(occupant => {
            if (typeof(occupant.generatePriceMods) === "function") {
                occupant.generatePriceMods();
            }
        });

        // Set the new location
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.RegistrySet, { key: "current-location", value: newLocation }));

        // Update the description
        let newDescription = `${newLocation.name}`;
        newDescription += `\n\n${newLocation.getFullDescription()}`;
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));

        this.rebuildCommands();
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
            inventory.add(purchaseOrder.merchandise.name, purchaseOrder.quantity);

            let newDescription = `You just bought ${purchaseOrder.quantity} ${purchaseOrder.merchandise.name} for \$${totalCost.toFixed(2)}. Enjoy!`;
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

        let newDescription = `You just borrowed \$${amountBorrowed.toFixed(2)}.`;
        newDescription += `\n\n${location.getFullDescription()}`;
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));

        this.rebuildCommands();
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

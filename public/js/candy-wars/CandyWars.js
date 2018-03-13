let game = null;
let engine = null;

window.onload = async function() {
    game = new CandyWars();
    game.start();
    
    /**
    TODO:

    Merge buy / sell commands
    Separate description into separate updateable parts (dialog, status, location description)
    Add cost to travel (time or money?)
    Add price spikes and drops
    Add game-over
    Add game-over after time
    Add robbery protection mechanism
    Add game-over after robbery/death
    Package engine source into sub-folder
    Drop-down to choose location
    Generate random cost between locations on start
    Create CommandUI classes to allow custom commands to handle their own rendering / retrieval

    Ideas:
    Buy territory?
    Sell at school
    Bullies who steal money and/or inventory
    Penalty for staying out late
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
            clock.addTime(travelTime, 0);
        }

        newLocation.generatePriceMods();

        // Set the new location
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.RegistrySet, { key: "current-location", value: newLocation }));

        // Update the description
        let newDescription = `You're standing at the counter inside ${newLocation.name}`;
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

    rebuildCommands() {
        let inventory = this.engine.registry.findValue('inventory');
        let currentLocation = this.engine.registry.findValue('current-location');

        // Clean up old commands
        for (let command of this.activeCommands) {
            this.engine.eventDispatcher.removeListener(command);
        }

        let commands = [];

        // Generate player buy commands
        for (let item of currentLocation.merchandise) {
            let command = new QuantityCommand(`buy-${item.id}`, `${item.name}`, null, 1, 'Buy', 'quantity');
            command.onExecute.push({ key: CustomGameEvents.BuyMerchandise, value: { merchandise: item, quantity: 1, unitPrice: currentLocation.merchandiseSellPrice(item.name) }});
            commands.push(command);
        }

        // Generate player sell commands
        let inventoryItems = inventory.all();
        for (let name in inventoryItems) {
            if (currentLocation.buys(name)) {
                let value = inventoryItems[name];
                let command = new QuantityCommand(`sell-${name}`, `${name}`, null, 1, 'Sell', 'quantity');
                command.onExecute.push({ key: CustomGameEvents.SellMerchandise, value: { itemName: name, quantity: 1, unitPrice: currentLocation.merchandiseBuyPrice(name) }});
                commands.push(command);    
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
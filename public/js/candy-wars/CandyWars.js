let game = null;
let engine = null;

window.onload = async function() {
    game = new CandyWars();
    game.start();
    
    /**
      TODO:
        Milestone: 

        Add UI for showing inventory
        Separate description into separate updateable parts (dialog, status, location description)
        Add UI for specifying quantity
        Add price spikes and drops
        Add game-over
        Add game-over after time
        Add robbery protection mechanism
        Add game-over after robbery/death
        Package engine source into sub-folder
        Drop-down to choose location
        Change game time based on travel

        Ideas:
        Buy territory?
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

        this.activeCommands = [];
    }

    start() {
        this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.LoadGameState, 'ingame'))
    }

    handleEvent(event) {
        if (event.id == GameEvents.LoadGameState) {
            let newGameState = event.data;

            this.engine.log(`Loading game state ${newGameState}`);
            if (newGameState == 'ingame') {
                GameStates.loadInGameState(this.engine);
            }
            else {
                throw new Error(`Unable to load game state '${newGameState}': No matching state was found.`);
            }
        }
        else if (event.id == CustomGameEvents.ChangeLocation) {
            let newLocation = event.data.location;

            // Clean up old commands
            for (let command of this.activeCommands) {
                this.engine.eventDispatcher.removeListener(command);
            }

            let commands = [];

            // Generate location-move commands
            this.engine.registry.findValue('locations').forEach((location) => {
                if (location.name != newLocation.name) {
                    let command = new Command(`travel-${location.name}`, `Travel to ${location.name}`, null);
                    command.onExecute.push({ key: CustomGameEvents.ChangeLocation, value: { location: location }});
                    commands.push(command);
                }
            });

            // Generate purchase commands
            for (let item of newLocation.merchandise) {
                let command = new Command(`buy-${item.id}`, `Buy 1 ${item.name}`, null);
                command.onExecute.push({ key: CustomGameEvents.BuyMerchandise, value: { merchandise: item, quantity: 1, unitPrice: newLocation.merchandisePrice(item.name) }});
                commands.push(command);
            }

            // Set the new commands
            this.activeCommands = commands;
            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateCommandsUI, { commands: this.activeCommands }));

            // Update the description
            let newDescription = `You're standing at the counter inside ${newLocation.name}`;
            newDescription += `\n\n${newLocation.getFullDescription()}`;
            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));

            // Save the new location
            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.RegistrySet, { key: "current-location", value: newLocation }));
        }
        else if (event.id == CustomGameEvents.BuyMerchandise) {
            let totalCost = event.data.unitPrice * event.data.quantity;
            let wealth = this.engine.registry.findValue('wealth');
            if (wealth == null) {
                throw new Error("Unable to locate player wealth in registry");
            }

            let location = this.engine.registry.findValue('current-location');
            if (wealth.wealth >= totalCost) {
                let newDescription = `You just bought ${event.data.quantity} ${event.data.merchandise.name} for \$${totalCost.toFixed(2)}. Enjoy!`;
                newDescription += `\n\n${location.getFullDescription()}`;
                this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));
                wealth.change(-totalCost);
            }
            else {    
                let newDescription = `You don't have enough money to buy that`;
                newDescription += `\n\n${location.getFullDescription()}`;
                this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));
            }            
        }
    }
}
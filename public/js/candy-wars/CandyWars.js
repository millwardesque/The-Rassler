let game = null;
let engine = null;

window.onload = async function() {
    game = new CandyWars();
    game.start();
    
    /**
      TODO:
        Milestone: Add vendor with merchandise for sale
        - Add merchandise list to location
        - Generate merchandise price on travel
        - Add command to buy single unit of merchandise

        Add UI for specifying quantity
        Add price spikes and drops
        Add game-over
        Add game-over after time
        Add robbery protection mechanism
        Add game-over after robbery/death
        Package engine source into sub-folder
        Drop-down to choose location
        Buy territory?
        Change game time based on travel
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

            for (let command of this.activeCommands) {
                this.engine.eventDispatcher.removeListener(command);
            }

            let commands = [];
            this.engine.registry.findValue('locations').forEach((location) => {
                if (location.name != newLocation.name) {
                    let command = new Command(`travel-${location.name}`, `Travel to ${location.name}`, null);
                    command.onExecute.push({ key: CustomGameEvents.ChangeLocation, value: { location: location }});
                    commands.push(command);
                }
            });

            this.activeCommands = commands;

            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateCommandsUI, { commands: commands }));
            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.RegistrySet, { key: "current-location", value: newLocation }));

            let newDescription = `You're standing in front of ${newLocation.name}`;
            newDescription += `\n\n${newLocation.description}`;
            newDescription += `\n\n${newLocation.vendor}: "Hi there! What can I get you?"`;
            this.engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.UpdateDescription, newDescription));
        }
    }
}
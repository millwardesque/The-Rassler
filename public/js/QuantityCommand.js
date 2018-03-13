class QuantityCommand extends Command {
    constructor(id, label, nextSceneNode, quantity, actionName) {
        super(id, label, nextSceneNode);

        this.quantity = quantity;
        this.actionName = actionName;

        engine.eventDispatcher.addListener(GameEvents.ExecuteCommand, this);
    }

    /**
     * Loads a command via an object literal instead of a list of params
     */
    static load(obj) {
        try {
            let command = new QuantityCommand(obj.id, obj.label, obj.nextSceneNode, obj.quantity);
            if ('isEnabled' in obj) {
                command.isEnabled = obj.isEnabled;
            }

            if ('onExecute' in obj) {
                command.onExecute = obj.onExecute;
            }
            return command;
        }
        catch(err) {
            throw new Error(`Unable to load quantity command from object: ${err}`);
        }
    }
}
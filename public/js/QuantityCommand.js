class QuantityCommand extends Command {
    constructor(id, label, quantity, actionName, onExecuteQuantityKey) {
        super(id, label);

        this.quantity = quantity;
        this.actionName = actionName;
        this.onExecuteQuantityKey = onExecuteQuantityKey;

        engine.eventDispatcher.addListener(GameEvents.ExecuteCommand, this);
    }

    execute() {
        for (let task of this.onExecute) {
            if (this.onExecuteQuantityKey in task.value) {
                task.value[this.onExecuteQuantityKey] = this.quantity;
            }
            else {
                this.debug(`Quantity key '${this.onExecuteQuantityKey}' not found`, task);
            }
        }

        super.execute();
    }

    /**
     * Loads a command via an object literal instead of a list of params
     */
    static load(obj) {
        try {
            let command = new QuantityCommand(obj.id, obj.label, obj.quantity);
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

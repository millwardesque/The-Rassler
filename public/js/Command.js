class Command extends GameObject {
    constructor(id, label) {
        super(id);

        this.id = id;
        this.label = label;
        this.onExecute = [];

        engine.eventDispatcher.addListener(GameEvents.ExecuteCommand, this);
    }

    execute() {
        for (let task of this.onExecute) {
            engine.eventDispatcher.dispatchEvent(new GameEvent(task.key, task.value));
        }
    }

    handleEvent(gameEvent) {
        if (gameEvent.id == GameEvents.ExecuteCommand && gameEvent.data.id == this.id) {
            this.execute();
        }
    }

    render(container) {
        let commandNode = webUtils.cloneTemplate('command');
        let label = GameUtils.processTemplate(this.label);
        commandNode.querySelector('.label').textContent = label;

        commandNode.addEventListener('click', clickEvent => {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();

            engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.ExecuteCommand, this));
        });

        container.appendChild(commandNode);
    }

    /**
     * Loads a command via an object literal instead of a list of params
     */
    static load(obj) {
        try {
            let command = new Command(obj.id, obj.label)
            if ('isEnabled' in obj) {
                command.isEnabled = obj.isEnabled;
            }

            if ('onExecute' in obj) {
                command.onExecute = obj.onExecute;
            }
            return command;
        }
        catch(err) {
            throw new Error(`Unable to load command from object: ${err}`);
        }
    }
}

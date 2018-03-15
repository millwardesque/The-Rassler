class NextSceneCommand extends Command {
    constructor(id, label, nextSceneNode) {
        super(id, label);
        this.nextSceneNode = nextSceneNode;

        engine.eventDispatcher.addListener(GameEvents.ExecuteCommand, this);
    }

    execute() {
        if (this.nextSceneNode) {
            engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.ActivateSceneNode, { sceneId: engine.activeScene.id, nodeId: this.nextSceneNode }));
        }

        super.execute();
    }

    /**
     * Loads a command via an object literal instead of a list of params
     */
    static load(obj) {
        try {
            let command = new NextSceneCommand(obj.id, obj.label, obj.nextSceneNode);
            if ('isEnabled' in obj) {
                command.isEnabled = obj.isEnabled;
            }

            if ('onExecute' in obj) {
                command.onExecute = obj.onExecute;
            }
            return command;
        }
        catch(err) {
            throw new Error(`Unable to load next-scene command from object: ${err}`);
        }
    }
}

class DescriptionUI extends GameObject {
    constructor(id, container) {
        super(id);

        if (container == null) {
            throw new Error("Null container passed to constructor.");
        }

        this.container = container;
        engine.eventDispatcher.addListener(GameEvents.OnSceneNodeChange, this);
        engine.eventDispatcher.addListener(GameEvents.UpdateDescription, this);
    }

    handleEvent(event) {
        if (event.id == GameEvents.OnSceneNodeChange) {
            this.render(event.data.description);
        }
        else if (event.id == GameEvents.UpdateDescription) {
            this.render(event.data);
        }
    }

    render(description) {
        webUtils.removeAllChildren(this.container);
        this.container.innerHTML = GameUtils.cleanAndProcessText(description);
    }
}

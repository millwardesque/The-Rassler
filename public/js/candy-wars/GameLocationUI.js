class GameLocationUI extends GameObject {
    constructor(id, container) {
        super(id);

        if (container == null) {
            throw new Error("Null container passed to constructor.");
        }

        this.container = container;
        engine.eventDispatcher.addListener(CustomGameEvents.OnLocationEnter, this);

        this.locationLabel = new TextUI('location-label', container.querySelector('.label'));
    }

    handleEvent(event) {
        if (event.id == CustomGameEvents.OnLocationEnter) {
            let location = event.data;
            this.render(location);
        }
    }

    render(location) {
        this.locationLabel.render(location.name);
    }
}

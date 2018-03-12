class WealthUI extends GameObject {
	constructor(id, container) {
		super(id);

		if (container == null) {
			throw new Error("Null container passed to constructor.");
		}

		this.container = container;
		engine.eventDispatcher.addListener(GameEvents.UpdateWealth, this);
	}

	handleEvent(event) {
		if (event.id == GameEvents.UpdateWealth) {
			this.render(event.data);
		}	
	}

	render(wealth) {
		this.container.innerHTML = `\$${wealth}`;
	}
}
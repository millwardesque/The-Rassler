class DescriptionUI {
	constructor(container) {
		if (container == null) {
			throw new Error("Null container passed to constructor.");
		}

		this.container = container;
		engine.eventDispatcher.addListener('Scene Change', this);
	}

	handleEvent(event) {
		this.render(event.data.description);
	}

	render(description) {
		webUtils.removeAllChildren(this.container);
		this.container.textContent = description;
	}
}
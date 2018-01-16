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

		// Remove any injected HTML
		description = webUtils.stripHtml(description);

		// Render new-lines
		description = description.replace(/\n/g, "<br />");

		// @TODO Render placeholders

		this.container.innerHTML = description;
	}
}
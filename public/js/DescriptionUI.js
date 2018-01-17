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

		// Render placeholders
		description = this.processTemplate(description);

		this.container.innerHTML = description;
	}

	processTemplate(template) {
		let matches = template.match(/\[%(.*?)%\]/g);
		let processed = template;
		if (matches.length > 0) {
			for (let match of matches) {
				let cleanMatch = match.replace(/\[%\s*/g, '');
				cleanMatch = cleanMatch.replace(/\s*%\]/g, '');
				let replacement = engine.registry.findValue(cleanMatch);
				if (replacement) {
					processed = processed.replace(match, replacement);
				}
				else {
					throw new Error(`No replacement value for ${match} was found`);
				}				
			}
		}

		return processed;
	}
}
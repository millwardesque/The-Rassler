class GameUtils {
	static processTemplate(template) {
		let matches = template.match(/\[%(.*?)%\]/g);
		let processed = template;
		if (matches !== null && matches.length > 0) {
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

	static cleanAndProcessText(text) {
        // Remove any injected HTML
        text = webUtils.stripHtml(text);

        // Render new-lines
        text = text.replace(/\n/g, "<br />");

        // Render placeholders
        text = GameUtils.processTemplate(text);
        return text;
	}
}

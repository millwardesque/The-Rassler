class GameClockUI {
	constructor(container) {
		if (container == null) {
			throw new Error("Null container passed to constructor.");
		}

		this.container = container;
		engine.eventDispatcher.addListener('GameClock-Change', this);
	}

	handleEvent(event) {
		this.render(event.data);
	}

	render(gameClock) {
		let node = webUtils.cloneTemplate('gameClock');
		node.querySelector('.hour').textContent = webUtils.padNumber(gameClock.hour, 2);
		node.querySelector('.minute').textContent = webUtils.padNumber(gameClock.minute, 2);

		webUtils.removeAllChildren(this.container);
		this.container.appendChild(node);
	}
}
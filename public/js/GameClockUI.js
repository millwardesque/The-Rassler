class GameClockUI extends GameObject {
	constructor(id, container) {
		super(id);

		if (container == null) {
			throw new Error("Null container passed to constructor.");
		}

		this.container = container;
		engine.eventDispatcher.addListener(GameEvents.OnGameTimeChange, this);
	}

	handleEvent(event) {
		if (event.id == GameEvents.OnGameTimeChange) {
			this.render(event.data.current);
		}
	}

	render(gameClock) {
		let node = webUtils.cloneTemplate('gameClock');
		node.querySelector('.day').textContent = gameClock.day;
		node.querySelector('.hour').textContent = webUtils.padNumber(gameClock.hour, 2);
		node.querySelector('.minute').textContent = webUtils.padNumber(gameClock.minute, 2);

		webUtils.removeAllChildren(this.container);
		this.container.appendChild(node);
	}
}

class GameClock extends GameObject {
	constructor(id) {
		super(id);
		this.hour = 0;
		this.minute = 0;

		engine.eventDispatcher.addListener(GameEvents.AddGameTime, this);
	}

	handleEvent(event) {
		if (event.id == GameEvents.AddGameTime) {
			this.addTime(event.data.hour, event.data.minute);
		}
	}

	setTime(hour, minute) {
		this.hour = hour;
		this.minute = minute;

		this.normalizeDate();

		engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.OnGameTimeChange, this));
	}

	addTime(deltaHours, deltaMinutes) {
		this.setTime(this.hour + deltaHours, this.minute + deltaMinutes);
	}

	normalizeDate() {
		while (this.minute > 59) {
			this.minute -= 60;
			this.hour++;
		}
		while (this.minute < 0) {
			this.minute += 60;
			this.hour--;
		}

		while (this.hour > 23) {
			this.hour -= 24;
		}
		while (this.hour < 0) {
			this.hour += 24;
		}
	}
}
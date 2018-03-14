class GameClock extends GameObject {
	constructor(id) {
		super(id);
		this.day = 0;
		this.hour = 0;
		this.minute = 0;

		engine.eventDispatcher.addListener(GameEvents.AddGameTime, this);
	}

	handleEvent(event) {
		if (event.id == GameEvents.AddGameTime) {
			this.addTime(event.data.day, event.data.hour, event.data.minute);
		}
	}

	setTime(day, hour, minute) {
		this.day = day;
		this.hour = hour;
		this.minute = minute;

		this.normalizeDate();

		engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.OnGameTimeChange, this));
	}

	addTime(deltaDays, deltaHours, deltaMinutes) {
		this.setTime(this.day + deltaDays, this.hour + deltaHours, this.minute + deltaMinutes);
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
			this.day++;
		}
		while (this.hour < 0) {
			this.hour += 24;
			this.day--;
		}

		// Clamp the minimum date to 0d 0h 0m
		if (this.day < 0) {
			this.day = 0;
			this.hour = 0;
			this.minute = 0;
		}
	}
}

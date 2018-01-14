class GameClock {
	constructor() {
		this.hour = 0;
		this.minute = 0;
	}

	setTime(hour, minute) {
		this.hour = hour;
		this.minute = minute;

		this.normalizeDate();

		engine.eventDispatcher.dispatchEvent(new GameEvent('GameClock-Change', this));
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
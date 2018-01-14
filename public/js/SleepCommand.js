class SleepCommand extends Command {
	constructor(name, label, sleepMinutes) {
		super(name, label);

		this.sleepMinutes = sleepMinutes;
	}

	execute(gameWorld) {
		console.log("You're now asleep!");
		engine.gameClock.addTime(0, this.sleepMinutes);
	}
}
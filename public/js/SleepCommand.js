class SleepCommand extends Command {
	constructor(name, label, sceneAfterExecution, sleepMinutes) {
		super(name, label, sceneAfterExecution);

		this.sleepMinutes = sleepMinutes;
	}

	execute(gameWorld) {
		console.log("You're now asleep!");
		engine.gameClock.addTime(0, this.sleepMinutes);
	}
}
class SleepCommand extends Command {
	constructor(id, name, label, sceneAfterExecution, sleepMinutes) {
		super(id, name, label, sceneAfterExecution);

		this.sleepMinutes = sleepMinutes;
	}

	execute(gameWorld) {
		console.log("You're now asleep!");
		engine.gameClock.addTime(0, this.sleepMinutes);
	}
}
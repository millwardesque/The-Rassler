class Home extends GameLocation {
    constructor(id, name, description) {
        super(id, name, description);
    }

    getCommands() {
        let commands = super.getCommands();

        let command = new QuantityCommand(`sleep`, `Hours`, 1, 'Sleep', 'hours');
        command.onExecute.push({ key: CustomGameEvents.Sleep, value: { days: 0, hours: 1, minutes: 0} });
        commands.push(command);

        return commands;
    }
}

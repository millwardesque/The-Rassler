class Home extends GameLocation {
    constructor(id, name, description) {
        super(id, name, description);
    }

    getCommands() {
        let commands = super.getCommands();

        let actions = {
            'sleep': { label: `Sleep`, onExecute: { key: CustomGameEvents.Sleep, value: { days: 0, hours: 1, minutes: 0} }},
        };
        let command = new QuantityCommand(`sleep`, `Hours`, 1, actions, 'hours');
        commands.push(command);

        return commands;
    }
}

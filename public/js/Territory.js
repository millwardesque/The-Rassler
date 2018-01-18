class Territory extends GameObject {
	constructor(id, name, rosterCapacity) {
		super(id);

		this.name = name;
		this.rosterCapacity = rosterCapacity;
		this.roster = [];

		engine.registry.append('territories', this.name);
	}

	hasCapacity() {
		return (this.rosterCapacity - this.roster.length) > 0;
	}
}
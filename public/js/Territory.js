class Territory {
	constructor(name, rosterCapacity) {
		this.name = name;
		this.rosterCapacity = rosterCapacity;
		this.roster = [];
	}

	hasCapacity() {
		return (this.rosterCapacity - this.roster.length) > 0;
	}
}
class Merchandise extends GameObject {
	constructor(id, name, baseCost, unit) {
		super(id);

		this.name = name;
		this.baseCost = baseCost;
		this.unit = unit;
	}
}
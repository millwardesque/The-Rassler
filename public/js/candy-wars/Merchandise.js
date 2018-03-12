class Merchandise extends GameObject {
	constructor(id, name, base_cost, unit) {
		super(id);
		this.name = name;
		this.base_cost = base_cost;
		this.unit = unit
	}
}
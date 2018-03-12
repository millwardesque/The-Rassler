class Location extends GameObject {
	constructor(id, name, description, vendor) {
		super(id);
		this.name = name;
        this.description = description;
        this.vendor = vendor;
	}
}
class Person extends GameObject {
	constructor(firstName, lastName) {
		super(`${firstName} ${lastName}`);

		this.firstName = firstName;
		this.lastName = lastName;
	}

	get fullName() {
		return `${this.firstName} ${this.lastName}`;
	}
}
class GameLocation extends GameObject {
    constructor(id, name, description) {
        super(id);

        this.name = name;
        this.description = description;
        this.occupants = [];
    }

    addOccupant(newOccupant) {
        for (let occupant of this.occupants) {
            if (occupant == newOccupant) {
                this.debug(`Unable to add occupant ${newOccupant.id}: Occupant is already at this location`);
                return;
            }
        }
        this.occupants.push(newOccupant);
    }

    getOccupants() {
        return this.occupants;
    }

    getFullDescription() {
        let description = `${this.description}`;

        if (this.occupants.length) {
            description += this.occupants.reduce((description, occupant) => description + `\n\n${occupant.getDescription()}`, '');
        }

        return description;
    }

    getCommands() {
        return [];
    }

    travelTime(destination) {
        return 1;
    }
}

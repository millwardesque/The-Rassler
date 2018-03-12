class Location extends GameObject {
	constructor(id, name, description, vendor) {
		super(id);

		this.name = name;
        this.description = description;
        this.vendor = vendor;
        this.merchandise = [];
        this.merchandisePriceMods = {};

        engine.eventDispatcher.addListener(CustomGameEvents.ChangeLocation, this);
	}

    addMerchandise(merchandise) {
        this.merchandise.push(merchandise);
        this.merchandisePriceMods[merchandise.name] = 1.0;
    }

    handleEvent(event) {
        if (event.id == CustomGameEvents.ChangeLocation && event.data.location == this) {
            for (let item of this.merchandise) {
                this.merchandisePriceMods[item.id] = 1 + (Math.random() - 0.5);
            }
        }
    }

    merchandisePrice(merchName) {
        let item = null;
        for (let merchandise of this.merchandise) {
            if (merchandise.name == merchName) {
                item = merchandise;
                break;
            }
        }

        if (item) {
            return item.baseCost * this.merchandisePriceMods[merchName];    
        }
        else {
            throw new Exception(`Merchandise ${merchName} not found in ${location.name}`);
        }        
    }

    getFullDescription() {
        let description = `${this.description}`;
        description += `\n\n${this.vendor}: "Hi there! What can I get you?"`;

        description += `\n\nMerchandise`;
        for (let item of this.merchandise) {
            description += `\n${item.name}: \$${this.merchandisePrice(item.name).toFixed(2)} / ${item.unit}`;
        }

        return description;
    }
}
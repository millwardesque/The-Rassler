class Vendor extends GameObject {
    constructor(id, name) {
        super(id);

        this.name = name;
        this.merchandise = [];
        this.merchandisePriceMods = {};
        this.buyPercentage = 0.8
    }

    getDescription() {
        let description = `${this.name}: "Hi there! What can I get for you?"`;
        if (this.merchandise.length) {
            description += `\n\nMerchandise`;
            for (let item of this.merchandise) {
                description += `\n${item.name}: Buy @ \$${this.merchandiseBuyPrice(item.name)} / Sell @ \$${this.merchandiseSellPrice(item.name)}`;
            }
        }
        return description;
    }

    addMerchandise(merchandise) {
        this.merchandise.push(merchandise);
        this.merchandisePriceMods[merchandise.id] = this.generatePriceMod();
    }

    generatePriceMods() {
        for (let item of this.merchandise) {
            this.merchandisePriceMods[item.id] = this.generatePriceMod();
        }

        this.buyPercentage = Math.min(0.5 + Math.random(), 0.9)
    }

    generatePriceMod() {
        return 1 + (Math.random() - 0.5);
    }

    merchandiseBuyPrice(merchName) {
        let item = null;
        for (let merchandise of this.merchandise) {
            if (merchandise.name == merchName) {
                item = merchandise;
                break;
            }
        }

        if (item) {
            return (item.baseCost * this.merchandisePriceMods[merchName] * this.buyPercentage).toFixed(2);
        }
        else {
            throw new Error(`Merchandise ${merchName} not found in ${location.name}`);
        }        
    }

    merchandiseSellPrice(merchName) {
        let item = null;
        for (let merchandise of this.merchandise) {
            if (merchandise.name == merchName) {
                item = merchandise;
                break;
            }
        }

        if (item) {
            return (item.baseCost * this.merchandisePriceMods[merchName]).toFixed(2);
        }
        else {
            throw new Error(`Merchandise ${merchName} not found in ${location.name}`);
        }
    }

    buys(merchName) {
        for (let merchandise of this.merchandise) {
            if (merchandise.name == merchName) {
                return true;
            }
        }

        return false;
    }	
}
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

    getCommands() {
        let inventoryItems = engine.registry.findValue('inventory').all();
        let commands = [];

        // Gather list of items this vendor sells.
        let itemList = this.merchandise.reduce((all, item) => {
            all[item.name] = ['buy'];
            return all;
        })

        // Gather list of items which the player has and this vendor buys.
        for (let key in inventoryItems) {
            let item = inventoryItems[key];
            if (!(item in itemList)) {
                itemList[item] = [];
            }

            itemList[item].push('sell');
        }

        // Player-buy commands
        for (let item of this.merchandise) {
            let buyPrice = this.merchandiseSellPrice(item.name);
            let command = new QuantityCommand(`buy-${item.id}`, `${item.name}`, 1, `Buy @ \$${buyPrice}`, 'quantity');
            command.onExecute.push({ key: CustomGameEvents.BuyMerchandise, value: { merchandise: item, quantity: 1, unitPrice: buyPrice }});
            commands.push(command);
        }

        // Player-sell commands
        for (let name in inventoryItems) {
            if (this.buys(name)) {
                let value = inventoryItems[name];
                let sellPrice = this.merchandiseSellPrice(name);
                let command = new QuantityCommand(`sell-${name}`, `${name}`, 1, `Sell @ \$${sellPrice} (up to ${value})`, 'quantity');
                command.onExecute.push({ key: CustomGameEvents.SellMerchandise, value: { itemName: name, quantity: 1, unitPrice: sellPrice }});
                commands.push(command);
            }
        }

        // Sort by name.
        commands.sort((a, b) => {
            if (a.label < b.label) {
                return -1;
            }
            else if (a.label > b.label) {
                return 1;
            }
            else {
                return 0;
            }
        });

        return commands;
    }
}

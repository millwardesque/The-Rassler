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
        let wealth = engine.registry.findValue('wealth');

        // Gather list of items this vendor sells.
        let itemList = this.merchandise.reduce((all, item) => {
            all[item.name] = ['player-buy'];
            return all;
        }, {});

        // Gather list of items which the player has and this vendor buys.
        for (let item in inventoryItems) {
            if (this.buys(item) && inventoryItems[item] > 0) {
                if (!(item in itemList)) {
                    itemList[item] = [];
                }

                itemList[item].push('player-sell');
            }
        }

        for (let item of Object.keys(itemList).sort()) {
            let actionTypes = itemList[item];
            let actions = {};

            if (actionTypes.includes('player-buy')) {
                let buyPrice = this.merchandiseSellPrice(item);
                let maxQuantity = Math.floor(wealth.wealth / buyPrice);
                actions['player-buy'] = { label: `Buy @ \$${buyPrice} (up to ${maxQuantity})`, onExecute: { key: CustomGameEvents.BuyMerchandise, value: { itemName: item, quantity: 1, unitPrice: buyPrice }}};
            }

            if (actionTypes.includes('player-sell')) {
                let numAvailable = inventoryItems[item];
                let sellPrice = this.merchandiseBuyPrice(item);
                actions['player-sell'] = { label: `Sell @ \$${sellPrice} (up to ${numAvailable})`, onExecute: { key: CustomGameEvents.SellMerchandise, value: { itemName: item, quantity: 1, unitPrice: sellPrice }}};
            }

            let command = new QuantityCommand(`vendor-${item}`, item, 1, actions, 'quantity');
            commands.push(command);
        }

        return commands;
    }
}

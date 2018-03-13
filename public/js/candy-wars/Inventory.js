class Inventory extends GameObject {
	constructor(id) {
        super(id);
        this.items = {};
    }

    set(name, quantity) {
        this.items[name] = quantity;
        engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.OnInventoryChange, this));
    }

    append(name, quantity) {
        if (!(name in this.items)) {
            this.items[name] = 0;
        }

        this.items[name] += quantity
        engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.OnInventoryChange, this));
    }

    get(name) {
        if (name in this.items) {
            return this.items[name];
        }
        else {
            return 0;
        }
    }
}
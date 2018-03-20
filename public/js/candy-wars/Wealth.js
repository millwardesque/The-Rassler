class Wealth extends GameObject {
    constructor(id, wealth = 0, borrowed = 0) {
        super(id);

        this.wealth = wealth;
        this.borrowed = borrowed;
    }

    change(delta) {
        this.wealth += delta;
        engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.UpdateWealth, this));
    }

    set(newWealth) {
        this.wealth = newWealth;
        engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.UpdateWealth, this));
    }

    setBorrowed(newBorrowed) {
        this.borrowed = newBorrowed;
        engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.UpdateWealth, this));
    }

    changeBorrowed(delta) {
        this.borrowed += delta;
        engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.UpdateWealth, this));
    }
}

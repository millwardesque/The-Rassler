class Wealth extends GameObject {
    constructor(id, wealth = 0) {
        super(id);

        this.wealth = wealth;
    }

    change(delta) {
        this.wealth += delta;
        engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.UpdateWealth, this.wealth));
    }

    set(newWealth) {
        this.wealth = newWealth;
        engine.eventDispatcher.dispatchEvent(new GameEvent(CustomGameEvents.UpdateWealth, this.wealth));
    }
}
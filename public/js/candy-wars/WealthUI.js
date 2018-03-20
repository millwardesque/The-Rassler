class WealthUI extends GameObject {
    constructor(id, container) {
        super(id);

        if (container == null) {
            throw new Error("Null container passed to constructor.");
        }

        this.container = container;
        this.wealthLabel = new TextUI('wealth-label', this.container.querySelector('.wealth'));
        this.borrowedLabel = new TextUI('borrowed-label', this.container.querySelector('.borrowed'));
        engine.eventDispatcher.addListener(CustomGameEvents.UpdateWealth, this);
    }

    handleEvent(event) {
        if (event.id == CustomGameEvents.UpdateWealth) {
            this.render(event.data);
        }
    }

    render(wealth) {
        this.wealthLabel.render(`\$${wealth.wealth.toFixed(2)}`);
        this.borrowedLabel.render(`\$${wealth.borrowed.toFixed(2)}`);
    }
}

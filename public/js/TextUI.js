class TextUI extends GameObject {
    constructor(id, container) {
        super(id);

        if (container == null) {
            throw new Error("Null container passed to constructor.");
        }

        this.container = container;
    }

    render(text, options) {
        webUtils.removeAllChildren(this.container);
        this.container.innerHTML = GameUtils.cleanAndProcessText(text);
    }
}

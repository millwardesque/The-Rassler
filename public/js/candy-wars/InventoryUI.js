class InventoryUI extends GameObject {
    constructor(id, container) {
        super(id);

        if (container == null) {
            throw new Error("Null container passed to constructor.");
        }

        this.container = container;
        engine.eventDispatcher.addListener(CustomGameEvents.OnInventoryChange, this);
    }

    handleEvent(event) {
        if (event.id == CustomGameEvents.OnInventoryChange) {
            this.render(event.data);
        }   
    }

    render(inventory) {
        webUtils.removeAllChildren(this.container);

        let hasEmptyInventory = true;

        if (inventory) {
            for (let name in inventory.items) {
                let quantity = inventory.items[name];

                if (quantity > 0) {
                    hasEmptyInventory = false;
                    this.renderInventoryItem(name, quantity);
                }
            }
        }

        if (hasEmptyInventory) {
            this.renderInventoryItem(null);
        }        
    }

    renderInventoryItem(name, quantity) {
        let domNode = webUtils.cloneTemplate('inventory-item');

        if (name != null) {
            domNode.querySelector('.name').textContent = name;
            domNode.querySelector('.quantity').textContent = `: ${quantity}`;
        }
        else {
            domNode.querySelector('.name').textContent = "You have nothing in your inventory.";
            domNode.querySelector('.quantity').textContent = '';
        }        

        this.container.appendChild(domNode);
    }
}
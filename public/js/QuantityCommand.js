class QuantityCommand extends Command {
    constructor(id, label, quantity, actions, onExecuteQuantityKey) {
        super(id, label);

        this.quantity = quantity;
        this.actions = actions;
        this.onExecuteQuantityKey = onExecuteQuantityKey;

        engine.eventDispatcher.addListener(GameEvents.ExecuteCommand, this);
    }

    execute() {
        for (let task of this.onExecute) {
            if (this.onExecuteQuantityKey in task.value) {
                task.value[this.onExecuteQuantityKey] = this.quantity;
            }
            else {
                this.debug(`Quantity key '${this.onExecuteQuantityKey}' not found`, task);
            }
        }

        super.execute();
    }

    render(container) {
        let commandNode = webUtils.cloneTemplate('quantity-command');
        let randomId = Math.floor(Math.random() * 1000000000);
        let formId = "quantity-command-form_" + randomId;
        let fieldId = "quantity-command_" + randomId;

        let form = commandNode.querySelector('form');
        form.id = formId;

        let field = commandNode.querySelector('#quantity-command');
        field.id = fieldId;

        form.querySelector('label').textContent = this.label;

        // Create all the buttons.
        for (let action in this.actions) {
            let actionButton = webUtils.cloneTemplate('quantity-command-submit');
            actionButton.value = action;
            actionButton.textContent = this.actions[action].label;

            actionButton.addEventListener('click', clickEvent => {
                clickEvent.preventDefault();
                clickEvent.stopPropagation();

                let quantity = Number(webUtils.stripHtml(field.value));
                if (quantity == "") {
                    return;
                }

                if (!Number.isInteger(quantity)) {
                    console.log(`Supplied quantity ${quantity} isn't a number. Ignoring.`);
                }
                else {
                    this.quantity = quantity;
                    this.onExecute.push(this.actions[action].onExecute);
                    engine.eventDispatcher.dispatchEvent(new GameEvent(GameEvents.ExecuteCommand, this));
                }

                field.value = "";
            });

            form.appendChild(actionButton);
        }

        container.appendChild(commandNode);
    }
}

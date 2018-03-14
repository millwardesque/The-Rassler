class MoneyLender extends (GameObject) {
    constructor(id, name, funds=0) {
        super(id);

        this.name = name;
        this.funds = funds;
        this.fundsOutstanding = 0;
    }

    getDescription() {
        let description = `${this.name}: "Hi there! Want to borrow some money, or pay back a loan?"`;

        if (this.funds > 0) {
            description += `\n\nYou can borrow up to \$${this.funds}`;
        }

        if (this.fundsOutstanding > 0) {
            description += `\n\nYou owe me \$${this.fundsOutstanding}`;
        }
        return description;
    }

    isOwedDebt() {
        return this.fundsOutstanding > 0;
    }

    repayDebt(amount) {
        if (this.fundsOutstanding < amount) {
            amount = this.fundsOutstanding;
        }
        this.funds += amount;
        this.fundsOutstanding -= amount;
        return amount;
    }

    borrowFunds(amount) {
        if (this.funds < amount) {
            amount = this.funds;
        }
        this.funds -= amount;
        this.fundsOutstanding += amount;

        return amount;
    }

    getCommands() {
        let commands = [];

        if (this.isOwedDebt()) {
            let command = new QuantityCommand(`repay-debt`, `Repay debt`, null, 1, 'Repay', 'amount');
            command.onExecute.push({ key: CustomGameEvents.RepayDebt, value: { lender: this, amount: 1 }});
            commands.push(command);
        }

        if (this.funds > 0) {
            let command = new QuantityCommand(`borrow-funds`, `Borrow funds`, null, 1, 'Borrow', 'amount');
            command.onExecute.push({ key: CustomGameEvents.BorrowFunds, value: { lender: this, amount: 1 }});
            commands.push(command);
        }

        return commands;
    }
}

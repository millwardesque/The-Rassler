class MoneyLender extends (GameObject) {
    constructor(id, name, funds=0) {
        super(id);

        this.name = name;
        this.funds = funds;
        this.fundsOutstanding = 0;
    }

    getDescription() {
        let description = `${this.name}: "Hi there!"`;

        if (this.funds > 0) {
            description += `\n\nYou can borrow up to \$${this.funds}`;
        }

        if (this.fundsOutstanding > 0) {
            description += `\n\nYou owe me \$${this.fundsOutstanding}`;
        }
        return description;
    }

    debtOwed() {
        return this.fundsOutstanding;
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
        let actions = {};

        if (this.funds > 0) {
            actions['borrow'] = { label: `Borrow (up to \$${this.funds})`, onExecute: { key: CustomGameEvents.BorrowFunds, value: { lender: this, amount: 1 }}};
        }

        if (this.isOwedDebt()) {
            actions['repay'] = { label: `Repay (\$${this.debtOwed()} owed)`, onExecute: { key: CustomGameEvents.RepayDebt, value: { lender: this, amount: 1 }}};
        }
        let command = new QuantityCommand(`loans`, `Loans`, 1, actions, 'amount');

        return [command];
    }
}

import Item from "./item";

export default class Inventory {
    public items: Item[] = [];
    private maxSize: number = 10;
    public money: number = 0;
    public fuel: number = 0;

    constructor(fuel?: number, money?: number) {
        fuel && (this.fuel = fuel);
        money && (this.money = money);
    }

    public addItem(item: Item): boolean {
        if (this.items.length < this.maxSize) {
            this.items.push(item);
            return true;
        } else {
            console.log("Inventory is full");
            return false;
        }
    }

    public removeItem(item: Item): boolean {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    public addMoney(amount: number): void {
        this.money += amount;
    }

    public spendMoney(amount: number): boolean {
        if (amount > this.money) {
            console.log("Not enough money");
            return false;
        }
        this.money -= amount;
        return true;
    }
}
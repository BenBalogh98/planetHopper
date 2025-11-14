import Inventory from "../inventory";
import Item from "../item";
export default class Trader {
    public inventory: Inventory = new Inventory();
    private originalFuelStock: number = 0;

    constructor() {
        for (let i = 0; i < 5; i++) {
            this.inventory.addItem(new Item());
        }

        this.inventory.fuel = Math.floor(Math.random() * 101) + 50; // 50 to 150 units of fuel
        this.originalFuelStock = this.inventory.fuel;
    }

    public restockFuel(): void {
        this.inventory.fuel = this.originalFuelStock;
    }

    public getTradeItems(): string[] {
        return [...this.inventory.items.map(item => item.name), `Fuel Stock: ${this.inventory.fuel} units`];
    }
}
import Inventory from "./inventory";

export default class Player {
    public name: string;
    public fuel: number = 100;
    public inventory: Inventory = new Inventory();

    constructor(name: string) {
        this.name = name;
    }

    public listItems(): void {
        if (this.inventory.items.length === 0) {
            console.log(`${this.name}'s inventory is empty.`);
        } else {
            console.log(`${this.name}'s inventory contains:`);
            this.inventory.items.forEach(item => {
                console.log(`- ${item}`);
            });
        }
    }

    public pickItem(item: string): void {
        if (this.inventory.addItem(item)) {
            console.log(`${this.name} picked up: ${item}`);
        }
    }

    public travel(distance: number): boolean {
        if (distance > this.fuel) {
            console.log(`${this.name} does not have enough fuel to travel.`);
            return false;
        }
        this.fuel -= distance;
        console.log(`${this.name} traveled ${distance} units.`);
        return true;
    }
}
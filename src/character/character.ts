import Inventory from "../inventory";
import Item from "../item";

export default class Character {
    public name: string | null = null;
    public inventory: Inventory = new Inventory();


    public sellItem(item: Item): void {
        // Implementation for selling an item
        this.inventory.removeItem(item);
        this.inventory.money += item.value;
    }

    public buyItem(item: Item): void {
        // Implementation for buying an item
        this.inventory.addItem(item);
        this.inventory.money -= item.value;
    }
}
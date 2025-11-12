import Inventory from "../inventory";
import Item from "../item";
import { ItemType } from "../types/enums";

export default class Trader {
    public inventory: Inventory[] = [];
    // the trader will have items. 
    // The items will be in the inventory.
    // Since the game is a trader game, the items can not have the same value. 
    // That means the current implementation of the
    // item class is not suitable for this.
    public async trade(): Promise<void> {
        // Implement trading logic here
    }
}
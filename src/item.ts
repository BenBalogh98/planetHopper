import { ItemType } from "./types/enums";

export default class Item {
    public name: ItemType;
    public value: number;

    constructor(name: ItemType) {
        this.name = name;
        this.value = this.getValueForType(name);
    }

    private getValueForType(type: ItemType): number {
        switch (type) {
            case ItemType.LIGHTSABER: return this.getRandomValue(900, 1100);
            case ItemType.BLASTER: return this.getRandomValue(250, 350);
            case ItemType.HYPERDRIVE: return this.getRandomValue(4500, 5500);
            case ItemType.POWER_CONVERTER: return this.getRandomValue(40, 60);
            case ItemType.HOLOCRON: return this.getRandomValue(2400, 2600);
            default: return 0;
        }
    }

    private getRandomValue(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
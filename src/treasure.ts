import Item from "./item";
import { TreasureType } from "./types/enums";

export interface TreasureReward {
    type: TreasureType;
    item?: Item;
    fuel?: number;
    credits?: number;
    description: string;
}

export default class Treasure {
    public reward: TreasureReward;

    constructor() {
        this.reward = this.generateRandomReward();
    }

    private generateRandomReward(): TreasureReward {
        const roll = Math.random();

        if (roll < 0.4) {
            // 40% chance for item treasure
            const item = new Item();
            return {
                type: TreasureType.ITEM,
                item: item,
                description: `You found a ${item.name}!`
            };
        } else if (roll < 0.7) {
            // 30% chance for fuel treasure
            const fuelAmount = this.getRandomFuelAmount();
            return {
                type: TreasureType.FUEL,
                fuel: fuelAmount,
                description: `You discovered a fuel cache containing ${fuelAmount} units of fuel!`
            };
        } else {
            // 30% chance for credits treasure
            const creditAmount = this.getRandomCreditAmount();
            return {
                type: TreasureType.CREDITS,
                credits: creditAmount,
                description: `You found a hidden stash of ${creditAmount} credits!`
            };
        }
    }

    private getRandomFuelAmount(): number {
        return Math.floor(Math.random() * 21) + 10;
    }

    private getRandomCreditAmount(): number {
        return Math.floor(Math.random() * 151) + 50;
    }

    public getDescription(): string {
        return this.reward.description;
    }

    public toString(): string {
        switch (this.reward.type) {
            case TreasureType.ITEM:
                return `Item: ${this.reward.item?.toString()}`;
            case TreasureType.FUEL:
                return `Fuel: ${this.reward.fuel} units`;
            case TreasureType.CREDITS:
                return `Credits: ${this.reward.credits}`;
            default:
                return "Unknown treasure";
        }
    }
}

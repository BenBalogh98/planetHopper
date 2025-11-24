import Encounter from "../event/encounter";
import Inventory from "../inventory";
import Item from "../item";
import Planet from "../planet";
import Character from "./character";
import Treasure from "../treasure";
import { TreasureType } from "../types/enums";

export default class Player extends Character {
    public inventory: Inventory = new Inventory(1000, 5000);
    public location: Planet | null = null;

    public getItems(): string[] {
        return [
            `Fuel: ${this.inventory.fuel} units`,
            `Credits: ${this.inventory.money}`,
            ...this.inventory.items.map(item => item.toString())
        ];
    }

    public pickItem(item: Item): void {
        if (this.inventory.addItem(item)) {
            console.log(`${this.name} picked up: ${item}`);
        }
    }

    public addFuel(amount: number): void {
        this.inventory.fuel += amount;
        console.log(`${this.name} gained ${amount} fuel! Total fuel: ${this.inventory.fuel}`);
    }

    public addCredits(amount: number): void {
        this.inventory.money += amount;
        console.log(`${this.name} gained ${amount} credits! Total credits: ${this.inventory.money}`);
    }

    public travel(planet: Planet): boolean {
        const distance = planet.getDistanceFrom(this.location);
        if (distance > this.inventory.fuel) {
            console.log(`${this.name} does not have enough fuel to travel.`);
            return false;
        }
        this.inventory.fuel -= distance;
        this.location = planet;
        console.log(`${this.name} traveled ${distance} units.`);
        return true;
    }

    public setLocation(planet: Planet): void {
        this.location = planet;
        console.log(`${this.name} is now at ${planet.name}.`);
    }

    public interactWithPlanet(): Encounter | null {
        return this.location?.interact() || null;
    }

    public applyAccidentEffects(): number {
        if (this.location?.encounter.start()) {
            const fuelLoss = Math.min(20, this.inventory.fuel);
            this.inventory.fuel -= fuelLoss;
            return fuelLoss;
        }
        return 0;
    }

    public applyTreasureEffects(treasure: Treasure): void {
        if (this.location?.encounter.start()) {
            console.log(`📜 ${treasure.getDescription()}`);

            switch (treasure.reward.type) {
                case TreasureType.ITEM:
                    if (treasure.reward.item) {
                        this.pickItem(treasure.reward.item);
                    }
                    break;
                case TreasureType.FUEL:
                    if (treasure.reward.fuel) {
                        this.addFuel(treasure.reward.fuel);
                    }
                    break;
                case TreasureType.CREDITS:
                    if (treasure.reward.credits) {
                        this.addCredits(treasure.reward.credits);
                    }
                    break;
            }
        }
    }
}
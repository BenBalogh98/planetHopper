import Encounter, { EncounterEntity } from "./encounter/encounter";
import Inventory from "./inventory";
import Item from "./item";
import Planet from "./planet";

export default class Player {
    public name: string | null = null;
    public fuel: number = 100;
    public inventory: Inventory = new Inventory();
    public location: Planet | null = null;

    public getItems(): string[] {
        return ["fuel: " + this.fuel.toString(), ...this.inventory.items.map(item => item.toString())];
    }

    public pickItem(item: Item): void {
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

    public setLocation(planet: Planet): void {
        this.location = planet;
        console.log(`${this.name} is now at ${planet.name}.`);
    }

    public interactWithPlanet(): Encounter | null {
        return this.location?.interact() || null;
    }
}
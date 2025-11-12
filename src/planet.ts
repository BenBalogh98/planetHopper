import Encounter from "./encounter/encounter";

export default class Planet {
    public name: string;
    public distanceFromSun: number;
    public encounter: Encounter = new Encounter();

    constructor(name: string, distanceFromSun: number) {
        this.name = name;
        this.distanceFromSun = distanceFromSun;
    }

    public getDistanceFrom(planet: Planet | null): number {
        if (!planet) {
            return this.distanceFromSun;
        }
        return Math.abs(this.distanceFromSun - planet.distanceFromSun);
    }

    public async interact(): Promise<void> {
        //console.log(`You are interacting with planet ${this.name}.`);
        await this.encounter.start();
    }
}

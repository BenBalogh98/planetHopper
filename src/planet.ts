export default class Planet {
    public name: string;
    public distanceFromSun: number;

    constructor(name: string, distanceFromSun: number) {
        this.name = name;
        this.distanceFromSun = distanceFromSun;
    }

    public getDistanceFromPlanet(planet: Planet): number {
        return Math.abs(this.distanceFromSun - planet.distanceFromSun);
    }
}

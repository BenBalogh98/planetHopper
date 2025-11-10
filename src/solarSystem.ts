import planet from "./planet";
import Planet from "./planet";

export default class SolarSystem {
    public planets: Planet[] = [];

    public addPlanet(planet: Planet): void {
        this.planets.push(planet);
    }

}
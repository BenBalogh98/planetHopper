import Planet from "./planet";

export default class SolarSystem {
    public planets: Planet[] = [];

    public addPlanet(planet: Planet): void {
        this.planets.push(planet);
    }

    public getPlanetByName(name: string): Planet | null {
        const planet = this.planets.find(p => p.name.toLowerCase() === name.toLowerCase());
        return planet || null;
    }
}
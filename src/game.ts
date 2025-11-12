import API from "./api";
import Planet from "./planet";
import Player from "./player";
import inquirer from "inquirer";
import SolarSystem from "./solarSystem";

export default class Game {
    public player: Player = new Player();
    private solarSystem: SolarSystem = new SolarSystem();
    private loadingInterval: NodeJS.Timeout | null = null;

    public async start(): Promise<void> {
        await this.loadPlanets();
        const answers: { username: string } = await inquirer.prompt([
            {
                type: "input",
                name: "username",
                message: "What is your username?",
            },
        ]);
        this.player.name = answers.username;
        console.log("Game started");
    }

    private async loadPlanets(): Promise<void> {
        const api = new API();
        this.displayLoadingMessage();
        const planets = await api.fetchData();

        planets.forEach((planetData) => {
            const planet = new Planet(planetData.name, planetData.distanceFromSun);
            this.solarSystem.addPlanet(planet);
        });
        this.hideLoadingMessage();
    }

    private displayLoadingMessage(): void {
        let dots = "";
        const loadingText = "Traveling to a galaxy far far away";
        this.loadingInterval = setInterval(() => {
            dots = dots.length >= 3 ? "" : dots + ".";
            process.stdout.write(`\r${loadingText}${dots}`);
        }, 400);
    }

    private hideLoadingMessage(): void {
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
            this.loadingInterval = null;
        }
        console.log("\rIn a galaxy far far away... Starting the adventure!");
    }

    public menu(): void {

    }

    private showHighScores(): void {
        console.log("High Scores feature is under development.");
    }

    private exitGame(): void {
        console.log("Exiting the game. Goodbye!");
        process.exit(0);
    }

    private showHelp(): void {
        console.log("Help section is under development.");
    }

    private travelPlayer(destination: string): boolean {
        if (!this.solarSystem) {
            console.log("❌ No solar system available for travel.");
            return false;
        }

        const planet = this.solarSystem.getPlanetByName(destination);
        if (!planet) {
            console.log(`❌ Planet "${destination}" not found.`);
            return false;
        }

        console.log(`🚀 Traveling to ${planet.name}...`);
        return true;
    }

    public getPlanetList(): Planet[] {
        return this.solarSystem.planets;
    }

    public getPlanetDistance(planetName: string): number | null {
        const planet = this.solarSystem.getPlanetByName(planetName);
        if (!planet) {
            return null;
        }

        return planet.getDistanceFrom(this.player.location);
    }
}

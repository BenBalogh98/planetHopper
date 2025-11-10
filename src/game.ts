import API from "./api";
import Planet from "./planet";
import Player from "./player";
import inquirer from "inquirer";
import SolarSystem from "./solarSystem";

export default class Game {
    private players: Player[] = [];
    private solarSystem: SolarSystem = new SolarSystem();
    private loadingInterval: NodeJS.Timeout | null = null;

    public addPlayer(player: Player): void {
        this.players.push(player);
    }

    public async start(): Promise<void> {
        await this.loadPlanets();
        const answers: { username: string } = await inquirer.prompt([
            {
                type: "input",
                name: "username",
                message: "What is your username?",
            },
        ]);
        const player = new Player(answers.username);
        this.addPlayer(player);
        console.log("Game started");
    }

    private async loadPlanets(): Promise<void> {
        const api = new API();
        this.displayLoadingMessage();
        const response = await api.fetchData();

        const data = await response.json();
        data.forEach((planetData: any) => {
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
        console.log("In a galaxy far far away... Starting the adventure!");
    }
}

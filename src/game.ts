import API from "./api";
import Planet from "./planet";
import Player from "./character/player";
import inquirer from "inquirer";
import SolarSystem from "./solarSystem";
import { EncounterType, TradeAction } from "./types/enums";
import Trader from "./event/trader";
import Item from "./item";
import { FUELCOST } from "./types/consts";

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

    public restockTraderFuel(): void {
        this.solarSystem.planets.forEach((planet) => {
            if (planet.encounter.entity instanceof Trader) {
                planet.encounter.entity.restockFuel();
            }
        });
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

    public buyFuelFromTrader(amount: number): void {
        if (!this.solarSystem) {
            console.log("❌ No active game. Start a game first!");
            return;
        }

        const trader = this.player.location?.encounter.entity as Trader;
        if (!trader) {
            console.log("❌ No trader found.");
            return;
        }

        const totalCost = amount * FUELCOST;
        if (this.player.inventory.money < totalCost) {
            console.log("🚫 You cannot afford this amount of fuel.");
            return;
        }

        this.player.inventory.money -= totalCost;
        trader.inventory.fuel -= amount;
        console.log(`⛽ ${this.player.name} bought ${amount} units of fuel for ${totalCost} credits.`);
    }

    public tradeWithTrader(tradeType: TradeAction, item: Item) {
        const planet = this.solarSystem.getPlanetByName(this.player.location?.name || "");

        if (!planet || !(planet.encounter.entity instanceof Trader)) {
            console.log("No trader found on this planet.");
            return;
        }



        const trader = planet.encounter.entity;

        if (tradeType === TradeAction.BUY) {
            if (item && this.player.inventory.money >= item.value) {
                this.player.buyItem(item);
                trader.sellItem(item);
                console.log(`${this.player.name} bought ${item.name} for ${item.value} credits.`);
            }
        } else if (tradeType === TradeAction.SELL) {
            if (item) {
                this.player.sellItem(item);
                trader.buyItem(item);
                console.log(`${this.player.name} sold ${item.name} for ${item.value} credits.`);
            }
        }

    }

    private hideLoadingMessage(): void {
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
            this.loadingInterval = null;
        }
        console.log("\rIn a galaxy far far away... Starting the adventure!");
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

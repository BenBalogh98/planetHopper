import inquirer from "inquirer";
import Game from "./game";
import { MenuOption, GameCommand, EncounterType, TreasureType } from "./types/enums";
import Trader from "./event/trader";
import Encounter from "./event/encounter";
import Item from "./item";
import Treasure from "./treasure";

export class GameController {
    private gameInstance: Game | null = null;
    private originalSigintHandler: NodeJS.SignalsListener[] = [];
    // RoundCount could be used for high scores as well.
    private roundCount: number = 0;

    // Command handlers
    public async startGame(): Promise<void> {
        console.log("🚀 Initializing Planet Hopper...");
        this.gameInstance = new Game();
        await this.gameInstance.start();
        await this.enterGameLoop();
    }

    public async showMenu(): Promise<void> {
        await inquirer
            .prompt([
                {
                    type: "list",
                    name: "menuOption",
                    message: "Select an option:",
                    choices: Object.values(MenuOption),
                },
            ])
            .then(async (answers) => {
                switch (answers.menuOption) {
                    case MenuOption.START_NEW_GAME:
                        await this.startGame();
                        break;
                    case MenuOption.VIEW_HIGH_SCORES:
                        this.showHighScores();
                        break;
                    case MenuOption.EXIT:
                        //this.exitGame();
                        break;
                    case MenuOption.HELP:
                        this.showGameHelp();
                        break;
                }
            });
    }

    public showHighScores(): void {
        console.log("=== High Scores ===");
        console.log("1. LukeS kywalker - 10,000 pts");
        console.log("2. Hans olo - 8,500 pts");
        console.log("3. Leia Or Gana - 7,200 pts");
    }

    public showInventory(): void {
        if (!this.gameInstance) {
            console.log("❌ No active game. Start a game first!");
            return;
        }
        this.gameInstance.player.getItems().forEach(item => {
            console.log(`- ${item}`);
        });
    }

    public async chooseStartingPlanet(): Promise<void> {
        if (!this.gameInstance) {
            console.log("❌ No active game. Start a game first!");
            return;
        }

        const planetList = this.gameInstance.getPlanetList().map((planet) => {
            return `${planet.name}`;
        });

        await inquirer
            .prompt([
                {
                    type: "list",
                    name: "startingPlanet",
                    message: "Select your starting planet:",
                    choices: planetList,
                },
            ])
            .then((answers) => {
                const selectedPlanet = this.gameInstance?.getPlanetList().find(planet => {
                    return planet.name === answers.startingPlanet;
                });

                if (selectedPlanet) {
                    this.gameInstance?.player.setLocation(selectedPlanet);
                }
            });
    }

    private async handlePlanetInteraction(): Promise<void> {
        if (!this.gameInstance) {
            console.log("❌ No active game. Start a game first!");
            return;
        }

        const encounter = this.gameInstance.player.interactWithPlanet();

        if (encounter instanceof Encounter) {
            switch (encounter.type) {
                case EncounterType.TRADER:
                    console.log("🤝 You have encountered a trader!");
                    await this.handleTraderInteraction(encounter.entity as Trader);
                    break;

                case EncounterType.TREASURE:
                    console.log("💎 You found treasure!");
                    await this.handleTreasureFound(encounter.entity as Treasure);
                    break;

                case EncounterType.ACCIDIENT:
                    console.log("💥 An accident occurred!");
                    await this.handleAccident();
                    break;

                case EncounterType.NOTHING:
                    console.log("🏞️ You explored the area but found nothing of interest.");
                    break;

                default:
                    console.log("🌌 Something mysterious happened...");
            }
        } else {
            console.log("🏞️ You interacted with the planet but nothing happened.");
        }
    }

    private async handleTraderInteraction(trader: Trader): Promise<void> {
        // TODO: Implement trader interaction logic
        // IMplement logic to view trader's items.
        // The buy/sell logic is alredy implemented, just neeed to do the communication with user part.

        // Made an error here...... since items can have different prices, simply passing an items name is not really sufficient.

        // This is a good sell logic. Will need a buy logic too. 
        // And the proper interface to interact with the trader.
        const itemChoices = this.gameInstance?.player.inventory.items.map(item => ({
            name: `${item.name} (${item.value} credits)`,  // What user sees
            value: item  // What gets returned - the actual Item object!
        }));

        const selection = await inquirer.prompt([{
            type: "list",
            name: "item",
            message: "Select an item to sell:",
            choices: itemChoices
        }]);

        // selection.item is now the actual Item object
        this.gameInstance?.tradeWithTrader("sell", selection.item);
        console.log("Trading functionality coming soon!");
    }

    private async handleTreasureFound(treasure: Treasure): Promise<void> {
        if (!this.gameInstance) {
            console.log("❌ No active game. Start a game first!");
            return;
        }

        console.log(`📜 ${treasure.getDescription()}`);

        switch (treasure.reward.type) {
            case TreasureType.ITEM:
                if (treasure.reward.item) {
                    this.gameInstance.player.pickItem(treasure.reward.item);
                }
                break;
            case TreasureType.FUEL:
                if (treasure.reward.fuel) {
                    this.gameInstance.player.addFuel(treasure.reward.fuel);
                }
                break;
            case TreasureType.CREDITS:
                if (treasure.reward.credits) {
                    this.gameInstance.player.addCredits(treasure.reward.credits);
                }
                break;
        }
    }

    private async handleAccident(): Promise<void> {
        const fuelLoss = this.gameInstance?.player.applyAccidentEffects();
        console.log(`💥 An accident occurred! Fuel lost: ${fuelLoss}`);
    }

    // With destination parameter, I can implement direct travel without prompt in the future.
    public async travel(destination?: string): Promise<boolean> {
        if (!this.gameInstance) {
            console.log("❌ No active game. Start a game first!");
            return false;
        }
        const availablePlanets = this.gameInstance.getPlanetList().filter(planet => planet !== this.gameInstance?.player.location);

        const planetList = availablePlanets.map((planet) => {
            return `${planet.name} - ${this.gameInstance?.getPlanetDistance(planet.name)}`;
        });

        planetList.unshift("Cancel");

        const answers = await inquirer.prompt([
            {
                type: "list",
                name: "destination",
                message: "Select a destination:",
                choices: planetList,
            },
        ]);

        if (answers.destination === "Cancel") {
            console.log("Travel cancelled.");
            return true;
        }
        const selectedPlanet = this.gameInstance?.getPlanetList().find(planet => {
            return `${planet.name} - ${this.gameInstance?.getPlanetDistance(planet.name)}` === answers.destination;
        });

        if (selectedPlanet) {
            const travelResult = this.gameInstance?.player.travel(selectedPlanet);

            // This is a bad desgin actually.
            // game over should trigger if and only if the fuel is less than required for travel AND
            // the planet does not offer refueling options.
            // In order to implement game over, I need the following:
            // Generate the planet interaction logic first
            // Get the refueling options from the planet
            // Check if any refueling options are possible for the user
            // If not, check if user has enough fuel for any travel.
            // if not, trigger game over. (return false).
            // If any of the above is available, return true. 
            // Then the user can interact with the planet to refuel ....
            // or quit the game.
            if (!travelResult) {
                console.log("💀 Game over: You ran out of fuel!");
            }
            this.roundCount++;
            if (this.roundCount % 20 === 0) {
                this.gameInstance.restockTraderFuel();
            }
            return travelResult;
        }

        return false;
    }

    private handleSIGINT(): void {
        this.originalSigintHandler = process.listeners('SIGINT');
        process.removeAllListeners('SIGINT');

        process.on('SIGINT', () => {
            console.log('\n\n👋 Thanks for playing Planet Hopper!');
            console.log('Game session ended.');
            process.exit(0);
        });
    }

    private async enterGameLoop(): Promise<void> {
        console.log("\n🎮 Entering interactive mode...");
        console.log("Type 'help' for commands or 'quit' to exit");

        this.handleSIGINT();

        // Import inquirer only when necessary
        const inquirer = await import("inquirer");

        let playing = true;
        // With the travel logic done, I should do the 'choose starting planet' 
        // logic, similar to travel.
        await this.chooseStartingPlanet();
        while (playing) {
            try {
                const answer = await inquirer.default.prompt([
                    {
                        type: "input",
                        name: "command",
                        message: "🌌 > ",
                    }
                ]);

                const [cmd, ...args] = answer.command.trim().split(" ");
                switch (cmd.toLowerCase()) {
                    case GameCommand.INVENTORY:
                    case GameCommand.INVENTORY_SHORT:
                        this.showInventory();
                        break;
                    case GameCommand.TRAVEL:
                        playing = await this.travel(args[0]);
                        break;
                    case GameCommand.LAND:
                    case GameCommand.INTERACT:
                        await this.handlePlanetInteraction();
                        break;
                    case GameCommand.HELP:
                        this.showGameHelp();
                        break;
                    case GameCommand.MENU:
                        await this.showMenu();
                        break;
                    case GameCommand.QUIT:
                    case GameCommand.EXIT:
                        playing = false;
                        console.log("👋 Thanks for playing Planet Hopper!");
                        break;
                    default:
                        console.log(`❓ Unknown command: ${cmd}`);
                        console.log("Type 'help' for available commands");
                }
            } catch (error: any) {
                // Handle Ctrl+C or other prompt errors
                if (error?.name === 'ExitPromptError') {
                    playing = false;
                    console.log('\n\n👋 Thanks for playing Planet Hopper!');
                } else {
                    console.error('An error occurred:', error?.message || 'Unknown error');
                }
            }
        }

        this.restoreOriginalSIGINTHandlers();
    }

    restoreOriginalSIGINTHandlers(): void {
        process.removeAllListeners('SIGINT');
        this.originalSigintHandler.forEach(handler => {
            process.on('SIGINT', handler as any);
        });
    }

    private showGameHelp(): void {
        console.log("\n=== Game Commands ===");
        console.log("inventory, inv    - Show your items, fuel, and credits");
        console.log("travel            - Travel to another planet");
        console.log("land, interact    - Interact with current planet");
        console.log("help              - Show this help");
        console.log("quit, exit        - Exit the game");
        console.log("menu              - Show main menu\n");
    }
}

export const gameController = new GameController();

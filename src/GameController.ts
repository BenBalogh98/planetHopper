import inquirer from "inquirer";
import Game from "./game";
import { MenuOption, GameCommand } from "./types/enums";

export class GameController {
    private gameInstance: Game | null = null;
    private originalSigintHandler: NodeJS.SignalsListener[] = [];
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

    public async travel(destination?: string): Promise<boolean> {
        if (!this.gameInstance) {
            console.log("❌ No active game. Start a game first!");
            return false;
        }

        const planetList = this.gameInstance.getPlanetList().map((planet) => {
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
            const travelResult = this.gameInstance?.player.travel(selectedPlanet.getDistanceFrom(this.gameInstance?.player.location));

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
                        await this.gameInstance?.player.interactWithPlanet();
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
        console.log("inventory, inv    - Show your items");
        console.log("travel <dest>     - Travel to destination");
        console.log("help             - Show this help");
        console.log("quit, exit       - Exit the game");
        console.log("menu             - Show main menu\n");
    }
}

export const gameController = new GameController();

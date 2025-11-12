// This file handles all command line argument parsing and setup
import { Command } from "commander";
import { gameController } from "./GameController";

class CommandManager {
    private program: Command;

    constructor() {
        this.program = new Command();
        this.setupMainCommand();
        this.setupSubCommands();
    }

    private setupMainCommand(): void {
        this.program
            .name('planet-hopper').alias('ph').alias('hopper')
            .description('A CLI space adventure game')
            .version('1.0.0')
            .action(async () => {
                // Default action when no command is provided
                await gameController.showMenu();
            });
    }

    private setupSubCommands(): void {
        this.program
            .command("menu")
            .description("Display the main menu for Planet Hopper game commands")
            .action(async () => {
                await gameController.showMenu();
            });

        this.program
            .command("start")
            .description("Start a new game")
            .action(async () => {
                await gameController.startGame();
            });

        this.program
            .command("high-scores")
            .description("Show high scores")
            .action(() => {
                gameController.showHighScores();

            });

        // Travel's distance parameter should be optional.
        this.program
            .command("travel [distance]")
            .description("Travel a certain distance")
            .action(async (distance: string | undefined) => {
                await gameController.travel(distance);
            });

        this.program
            .command("inventory")
            .description("Show inventory items")
            .action(() => {
                gameController.showInventory();
            });

        this.program
            .command("choose-planet")
            .description("Choose a starting planet")
            .action(async () => {
                await gameController.chooseStartingPlanet();
            });
    }

    public parse(): void {
        this.program.parse();
    }
}

export const commandManager = new CommandManager();
// Parse arguments when the module is imported
commandManager.parse();

import inquirer from "inquirer";
import Game from "./game";

const game = new Game();
await game.start();


const colorAnswers: { color: string } = await inquirer.prompt([
    {
        type: "list",
        name: "color",
        message: "Choose your favorite color:",
        choices: ["Red", "Green", "Blue"],
    },
]);

console.log(`You chose: ${colorAnswers.color}`);
npx tsc
node dist/main.js

use 'npm run watch' to run the TS code and get changes immediately.
npx hopper to run the game.

TODO:

register 4 commands. help, start, high scores and menu. Menu shows a list with the other 3 prompts. help provides a description about the game. start starts the game. high score shows the high scores table

The game: 
Overall, a trading game. Each planet will have something to trade and something to buy. There will be only a few type of items. User can buy fuel on certain planets, sell stuff on other planets. If done well, the user can travel and trade endlessly. But its not going to be very easy.
Every trading post will be generated randomly, since I would need to add a lot of stuff to the database otherwise :D
Choose a starting planet, this wont consume fuel. Or just always start on a planet.
Travelling:
When choosing a destination, the user will always see how much fuel the travel would consume. User will be able to choose from the list of planets showing names and fuel cost:
Naboo - 5
Endor - 18
....
The fuel cost depends on the current location, ofc.
When arriving, the user can choose to interact with the planet or go on.
If interacts, 60% chance to find a trader. 10% chance for an accidient (lose item or fuel), 20% chance to find something, 10% chance to find nothing.

Will figure out the rest later....
Use commander library to register the commands.


At the end, I need to be sure to place every log to the gameController, make sure to have no duplicate or unnecessary functions, every function is in the correct class.


There are 2 options:
Generate a random encounter for the planet whenever it is visited:
Visiting the same planet should logically have different result each time
from gameplay perspective, this is terrible. I can just travel between the 2 closest planet.


or generate everything when they are created:
Not the best from real world perspective.
Much better from gameplay persperctive, because why would anyone visit a far away planet if they can just keep jumping between the 2 closest planet?
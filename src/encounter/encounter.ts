import { EncounterType } from "../types/enums";

export default class Encounter {
    //public description: string;

    //60% chance to find a trader. 10% chance for an accidient (lose item or fuel), 20% chance to find something, 10% chance to find nothing.
    public type: EncounterType;

    constructor() {
        //this.description = description;
        //this.type = type;
        const roll = Math.random();
        if (roll < 0.6) {
            this.type = EncounterType.TRADER;
        } else if (roll < 0.7) {
            this.type = EncounterType.HOSTILE;
        } else if (roll < 0.9) {
            this.type = EncounterType.TREASURE;
        } else {
            this.type = EncounterType.NOTHING;
        }
    }

    public async start(): Promise<void> {
        switch (this.type) {
            case EncounterType.TRADER:
                console.log("You have encountered a trader!");
                // Implement trader interaction logic here
                break;
            case EncounterType.HOSTILE:
                console.log("You have encountered a hostile entity!");
                // Implement hostile encounter logic here
                break;
            case EncounterType.TREASURE:
                console.log("You have found a treasure!");
                // Implement treasure encounter logic here
                break;
            case EncounterType.NOTHING:
                console.log("Nothing interesting happened. This planet seems deserted.");
                break;
        }
    }
}
import Item from "../item";
import { EncounterType } from "../types/enums";
import Trader from "./trader";

export type EncounterEntity = Trader | Item | string | null;

export default class Encounter {
    //public description: string;

    //60% chance to find a trader. 10% chance for an accidient (lose item or fuel), 20% chance to find something, 10% chance to find nothing.
    public type: EncounterType;
    public entity: EncounterEntity = null;
    // If treasure/accidient is triggered, it will be disabled from that point on.
    // Accidients triggered when user interacts with the planet (lands on it).
    // Treasures triggered when user picks them up.
    public isEncounterDisabled: boolean = false;

    constructor() {
        const roll = Math.random();
        if (roll < 0.6) {
            this.type = EncounterType.TRADER;
            this.entity = new Trader();
        } else if (roll < 0.7) {
            this.type = EncounterType.ACCIDIENT;
            this.entity = "accidient";
        } else if (roll < 0.9) {
            this.type = EncounterType.TREASURE;
            this.entity = new Item();
        } else {
            this.type = EncounterType.NOTHING;
        }
    }

    public start(): EncounterEntity {
        if (this.isEncounterDisabled) {
            return null;
        }
        if (this.type === EncounterType.ACCIDIENT) {
            this.isEncounterDisabled = true;
        }
        return this.entity;
    }
}
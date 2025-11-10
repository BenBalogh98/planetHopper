export default class Inventory {
    public items: string[] = [];
    private maxSize: number = 10;
    public addItem(item: string): boolean {
        if (this.items.length < this.maxSize) {
            this.items.push(item);
            return true;
        } else {
            console.log("Inventory is full");
            return false;
        }
    }

    public removeItem(item: string): boolean {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
}
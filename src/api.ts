import { IPlanet } from "./types/DTOs";

export default class API {
    public async fetchData(): Promise<IPlanet[]> {
        const response = await fetch("https://sw-ej2a.onrender.com/planets");
        const data = await response.json();
        return data.map((item: any) => ({
            name: item.name,
            distanceFromSun: item.distanceFromSun,
        }));
    }
}
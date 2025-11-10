export default class API {
    public async fetchData() {
        return fetch("https://sw-ej2a.onrender.com/planets");
    }
}
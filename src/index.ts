class Store {
    static #instance: Store

    private constructor() {}

    public static get instance() {
        if (!Store.#instance) {
            Store.#instance = new Store()
        }
        return Store.#instance
    }
}

import { StoreService } from './database/services/store.service.js'
import { playDemo } from './demo.js'

export class Store extends StoreService {
    static #instance: Store

    private constructor() {
        super()
    }

    static get instance() {
        if (!Store.#instance) {
            Store.#instance = new Store()
        }
        return Store.#instance
    }
}

// Welcome to the store - it is not open yet
const store = Store.instance

// Connects to the DB, and fetches and inserts the products from the provided API (if the products table is empty)
await store.openStore()

await playDemo(store)

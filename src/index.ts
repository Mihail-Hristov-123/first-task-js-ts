import { AppDataSource, connectToDatabase } from './database/connection.js'
import { Product } from './database/entity/Product.js'
import { fetchProducts } from './database/population.js'

class Store {
    static #instance: Store

    private constructor() {}

    static get instance() {
        if (!Store.#instance) {
            Store.#instance = new Store()
        }
        return Store.#instance
    }

    static async establishConnection() {
        await connectToDatabase()
    }

    static async refreshProducts() {
        try {
            const newProducts = await fetchProducts()
            const storeRepo = AppDataSource.getRepository(Product)
            for (const article of newProducts) {
                await storeRepo.create({ ...article })
                console.log(`Article with id ${article.id} added to the DB.`)
            }
        } catch (error) {
            console.error(`Product update failed: ${error}`)
        }
    }
}

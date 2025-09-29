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
            const productRepo = AppDataSource.getRepository(Product)
            for (const article of newProducts) {
                const newArticle = new Product()
                newArticle.description = article.description
                newArticle.name = article.title
                newArticle.price = article.price
                await productRepo.save(newArticle)
            }
        } catch (error) {
            console.error(error)
        }
    }
}

await Store.establishConnection()
await Store.refreshProducts()

import { AppDataSource, connectToDatabase } from './database/connection.js'
import { Product } from './database/entity/Product.js'
import { fetchProducts } from './database/population.js'
import { productRepo } from './database/repository.js'

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
            let productAddedCount = 0
            for (const article of newProducts) {
                const { description, title: name, price } = article
                const newArticle = new Product()
                newArticle.description = description
                newArticle.name = name
                newArticle.price = price
                await productRepo.save(newArticle)
                productAddedCount++
            }
            console.log(
                `${productAddedCount} products have been added to the store`,
            )
        } catch (error) {
            console.error(error)
        }
    }

    static async removeAllProducts() {
        try {
            await productRepo.clear()
            console.log('All products have been removed - the store is empty')
        } catch (error) {
            console.error(`Error occurred during product removal: ${error}`)
        }
    }
}

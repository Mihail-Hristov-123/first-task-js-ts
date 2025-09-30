import { AppDataSource, connectToDatabase } from './database/connection.js'
import { Customer, PremiumCustomer } from './database/entity/Customer.js'
import { Product } from './database/entity/Product.js'
import { fetchProducts } from './database/population.js'

import { quantityGenerator } from './helpers/quantityGenerator.js'

export const customerRepo = AppDataSource.getRepository(Customer)
export const productRepo = AppDataSource.getRepository(Product)
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

    static async initializeProducts() {
        try {
            const newProducts = await fetchProducts()
            const productsToInitialize: Product[] = []
            for (const article of newProducts) {
                const { description, title: name, price } = article
                const newArticle = new Product(
                    name,
                    description,
                    price,
                    quantityGenerator(),
                )
                productsToInitialize.push(newArticle)
            }
            await productRepo.insert(productsToInitialize)
            console.log(
                `${productsToInitialize.length} products have been added to the store`,
            )
        } catch (error) {
            console.error(`Products initialization error: ${error}`)
        }
    }

    static async removeAllProducts() {
        try {
            await customerRepo.clear()
            console.log('All products have been removed - the store is empty')
        } catch (error) {
            console.error(`Error occurred during product removal: ${error}`)
        }
    }
}

await Store.establishConnection()
const joe = new PremiumCustomer('Josh WIlliams', 1000)
await customerRepo.save(joe)

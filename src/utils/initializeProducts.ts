import { Product } from '../database/entity/Product.js'
import { fetchProducts } from '../database/population.js'
import { productRepo } from '../database/connection.js'

import { generateRandomQuantity } from './generateRandomQuantity.js'

export const initializeProducts = async () => {
    try {
        const newProducts = await fetchProducts()
        const productsToInitialize: Product[] = []
        for (const article of newProducts) {
            const { description, title: name, price } = article
            const newArticle = new Product(
                name,
                description,
                price,
                generateRandomQuantity(),
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

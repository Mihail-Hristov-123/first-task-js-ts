import { Product } from '../database/entity/product.entity.js'

import { productRepo } from '../database/connection.js'

import { generateRandomQuantity } from './generateRandomQuantity.js'

const PRODUCT_API_URL = 'https://fakestoreapi.com/products'

const fetchProducts = async () => {
    try {
        const response = await fetch(PRODUCT_API_URL)
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Product fetch and DB population failed: ${error}`)
    }
}

export const initializeProducts = async () => {
    try {
        const newProducts = await fetchProducts()
        const productsToInitialize: Product[] = []
        for (const article of newProducts) {
            if (!Product.isProduct(article)) {
                console.warn('Invalid product found and skipped:', article)
                continue
            }
            const { description, title, price } = article
            const newArticle = new Product(
                title,
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

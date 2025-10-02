import type { Order } from '../database/entity/order.entity.js'
import { productRepo } from '../database/connection.js'
import type { Product } from '../database/entity/product.entity.js'

// reduces the quantity of all the products contained in the paid orders of a customer
export const reduceAllOrdersProductQuantity = async (orders: Order[]) => {
    for (const order of orders) {
        await reduceSingleOrderProductsQuantity(order.products)
    }
}

const reduceSingleOrderProductsQuantity = async (products: Product[]) => {
    try {
        for (const product of products) {
            product.quantityInStock -= 1
            await productRepo.save(product)
            console.log(`Product ${product.id}'s quantity was reduced`)
        }
    } catch (error) {
        console.error(
            `An error occurred during the reduction of a product's quantity`,
        )
    }
}

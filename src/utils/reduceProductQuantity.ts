import type { Order } from '../database/entity/Order.js'
import { productRepo } from '../database/connection.js'

export const reduceProductQuantity = async (orders: Order[]) => {
    for (const order of orders) {
        for (const product of order.products) {
            product.quantityInStock -= 1
            await productRepo.save(product)
            console.log(`Product ${product.id}'s quantity was reduced`)
        }
    }
}

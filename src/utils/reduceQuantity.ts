import type { Order } from '../database/entity/Order.js'
import type { Product } from '../database/entity/Product.js'
import { productRepo } from '../index.js'

// fix later - doesn't seem to work when the quantity of a product is reduced more than twice



const reduceProductQuantity = async (product: Product) => {

    await product.modifyProduct('decreaseQuantity')
    console.log(
        `The available quantity of product with ID ${product.id} was reduced`,
    )
}

export const reduceQuantityFromOrder = async (orders: Order[]) => {
    for (const order of orders) {
        await Promise.all(
            order.products.map((item) => reduceProductQuantity(item)),
        )
    }
}

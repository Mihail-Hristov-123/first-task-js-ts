import type { Order } from '../database/entity/order.entity.js'

export const calculateOrderTotal = (order: Order) => {
    const total = order.products.reduce(
        (total, product) => (total += product.price),
        0,
    )
    return total
}

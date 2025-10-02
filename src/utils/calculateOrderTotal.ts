import type { Order } from "../database/entity/Order.js";

export const calculateOrderTotal = (order: Order) => {
    const total = order.products.reduce((total, product) => total += product.price, 0)
    return total
}
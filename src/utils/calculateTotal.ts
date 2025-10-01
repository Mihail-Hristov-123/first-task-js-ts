import type { Order } from '../database/entity/Order.js'

const DISCOUNT_COEFFICIENT = 0.1

export const calculateTotal = (
    orders: Order[],
    shouldReceiveDiscount: boolean,
) => {
    const ordersTotal = orders.reduce(
        (sum: number, order) => (sum += order.total),
        0,
    )

    if (!shouldReceiveDiscount) {
        return ordersTotal
    }

    const discountAmount = Number(
        (ordersTotal * DISCOUNT_COEFFICIENT).toFixed(2),
    )
    console.log(
        `A discount of $${discountAmount} has been applied due to premium membership`,
    )
    return ordersTotal - discountAmount

    // return shouldReceiveDiscount ? ordersTotal * (1 - DISCOUNT_COEFFICIENT) : ordersTotal
}

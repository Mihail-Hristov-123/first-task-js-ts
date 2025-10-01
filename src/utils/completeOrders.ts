import type { Order } from '../database/entity/Order.js'
import { orderRepo } from '../index.js'

// sets orders statuses to complete

export const completeOrders = async (orders: Order[] | Order) => {
    if (!Array.isArray(orders)) orders = [orders]
    for (const order of orders) {
        console.log(order)
        const currentOrder = await orderRepo.findOneBy({ id: order.id })
        if (!currentOrder) {
            throw new Error(`Order with  was not found`)
        }
        order.status = 'complete'
        await orderRepo.save(order)
    }
}

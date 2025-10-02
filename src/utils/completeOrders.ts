import type { Order } from '../database/entity/order.entity.js'
import { orderRepo } from '../database/connection.js'

// sets paid orders statuses to complete
export const completeOrders = async (orders: Order[]) => {
    for (const currentOrder of orders) {
        currentOrder.status = 'complete'
        try {
            await orderRepo.save(currentOrder)
            console.log(
                `Order ${currentOrder.id}'s status has been set to completed`,
            )
        } catch (error) {
            console.error(
                `Error occurred during order #${currentOrder.id}'s status change`,
            )
        }
    }
}
